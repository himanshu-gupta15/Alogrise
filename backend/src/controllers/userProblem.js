import { getLanguageById, submitBatch, submitToken } from "../utils/problemUtility.js";
import Problem from "../models/problem.js";
import User from "../models/user.js";
import Submission from "../models/submission.js";
import SolutionVideo from "../models/solutionVideo.js";

const normalizeCompanies = (companies) => {
  if (!Array.isArray(companies)) return [];

  const cleaned = companies
    .map((company) => (typeof company === "string" ? company.trim() : ""))
    .filter(Boolean);

  return [...new Set(cleaned)];
};

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    const cleaned = tags
      .map((tag) => (typeof tag === "string" ? tag.trim().toLowerCase() : ""))
      .filter(Boolean);

    return [...new Set(cleaned)];
  }

  if (typeof tags === "string") {
    const cleaned = tags
    .split(/[,\n]/)
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    return [...new Set(cleaned)];
  }

  return [];
};

/* ================= UTILITY FUNCTIONS ================= */

/**
 * Recalculates and updates the global rank for all users based on XP.
 */
const updateGlobalRank = async () => {
  try {
    // Only fetch the fields needed; _id breaks ties so ranks are stable between runs
    const users = await User.find({}).select("_id globalRank").sort({ xp: -1, _id: 1 }).lean();

    // Only write ranks that actually changed, in a single round trip
    const ops = users
      .map((user, index) => ({ user, rank: index + 1 }))
      .filter(({ user, rank }) => user.globalRank !== rank)
      .map(({ user, rank }) => ({
        updateOne: { filter: { _id: user._id }, update: { $set: { globalRank: rank } } },
      }));

    if (ops.length > 0) await User.bulkWrite(ops, { ordered: false });
  } catch (err) {
    console.error("Rank Update Error:", err);
  }
};

/**
 * Logic to update streak, XP, and problemSolved array.
 */
const handleStreakAndSolved = async (userId, problemId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let newStreak = user.streak || 0;
  const lastDate = user.lastSolvedDate
    ? new Date(user.lastSolvedDate.getFullYear(), user.lastSolvedDate.getMonth(), user.lastSolvedDate.getDate())
    : null;

  if (!lastDate) {
    newStreak = 1;
  } else {
    const diffTime = today - lastDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      newStreak += 1; // Solved yesterday, increment streak
    } else if (diffDays > 1) {
      newStreak = 1; // Missed a day, reset streak
    }
    // If diffDays === 0, streak remains unchanged as they already solved one today
  }

  // XP is only awarded the first time a problem is solved
  const alreadySolved = (user.problemSolved || []).some((id) => id.toString() === problemId.toString());

  await User.findByIdAndUpdate(userId, {
    $addToSet: { problemSolved: problemId },
    $set: {
      streak: newStreak,
      lastSolvedDate: now,
    },
    ...(alreadySolved ? {} : { $inc: { xp: 10 } }),
  });

  if (!alreadySolved) await updateGlobalRank();

  const updatedUser = await User.findById(userId).select("streak xp globalRank");
  return {
    streak: updatedUser?.streak || 0,
    xp: updatedUser?.xp || 0,
    globalRank: updatedUser?.globalRank || 0,
  };
};

/* ================= CORE CONTROLLERS ================= */

const createProblem = async (req, res) => {
  const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution = [], skipJudge = false } = req.body;

  try {
    const shouldValidate = !skipJudge && process.env.SKIP_JUDGE_ON_CREATE !== 'true';

    if (shouldValidate && Array.isArray(referenceSolution) && referenceSolution.length > 0) {
      for (const { language, completeCode } of referenceSolution) {
        const languageId = getLanguageById(language);
        const normalizedCode = (completeCode || '').replace(/\\n/g, "\n");

        const submissions = (visibleTestCases || []).map((testcase) => ({
          source_code: normalizedCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output,
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        for (const test of testResult) {
          if (test.status_id !== 3) {
            return res.status(400).send("Error Occurred in Reference Solution");
          }
        }
      }
    }

    const normalizedTags = normalizeTags(tags);
    if (normalizedTags.length === 0) {
      return res.status(400).send("At least one topic is required");
    }

    // Determine status: admin problems are auto-approved, user problems are pending
    const isAdmin = req.result.role === 'admin';
    const status = isAdmin ? 'approved' : 'pending';

    await Problem.create({
      ...req.body,
      tags: normalizedTags,
      companies: normalizeCompanies(req.body.companies),
      problemCreator: req.result._id,
      status: status,
    });

    res.status(201).send("Problem Saved Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const getUserProblems = async (req, res) => {
  try {
    const userId = req.result._id;
    const problems = await Problem.find({ problemCreator: userId }).select("_id title difficulty tags status createdAt");
    res.status(200).send(problems);
  } catch (err) {
    res.status(500).send('Error: ' + err);
  }
};

const getPendingProblems = async (req, res) => {
  try {
    const problems = await Problem.find({ status: 'pending' }).select("_id title difficulty tags problemCreator createdAt").populate('problemCreator','firstName lastName emailId');
    res.status(200).send(problems);
  } catch (err) {
    res.status(500).send('Error: ' + err);
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("Missing ID Field");

    const payload = {
      ...req.body,
    };

    if (Object.prototype.hasOwnProperty.call(req.body, "companies")) {
      payload.companies = normalizeCompanies(req.body.companies);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "tags")) {
      payload.tags = normalizeTags(req.body.tags);
      if (payload.tags.length === 0) {
        return res.status(400).send("At least one topic is required");
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(id, payload, { runValidators: true, new: true });
    if (!newProblem) return res.status(404).send("Problem is Missing");
    res.status(200).send(newProblem);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("ID is Missing");
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) return res.status(404).send("Problem is Missing");
    res.status(200).send("Successfully Deleted");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const getProblem = await Problem.findById(id).select("_id title description difficulty tags companies visibleTestCases hiddenTestCases startCode referenceSolution status problemCreator");
    if (!getProblem) return res.status(404).send("Problem is Missing");

    const isAdmin = req.result?.role === "admin";
    const isCreator = getProblem.problemCreator?.toString() === req.result?._id?.toString();
    // Legacy problems (created before status field) have no status field, treat as published
    const isPublished = getProblem.status === "approved" || getProblem.status == null || getProblem.status === undefined;
    if (!isAdmin && !isCreator && !isPublished) {
      return res.status(403).send("Problem is not published yet");
    }

    // Hidden test cases and reference solutions are only for admins (the update form needs them)
    const problemData = getProblem.toObject();
    if (!isAdmin) {
      delete problemData.hiddenTestCases;
      delete problemData.referenceSolution;
    }

    // Newest upload wins when a problem has more than one video
    const videos = await SolutionVideo.findOne({ problemId: id }).sort({ createdAt: -1 });
    const responseData = videos
      ? { ...problemData, secureUrl: videos.secureUrl, thumbnailUrl: videos.thumbnailUrl, duration: videos.duration }
      : problemData;

    res.status(200).send(responseData);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const isAdmin = req.result?.role === "admin";
    const filter = isAdmin ? {} : { $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }] };
    const problems = await Problem.find(filter).select("_id title difficulty tags status companies");
    if (!problems || problems.length === 0) return res.status(200).send([]);

    const userId = req.result?._id;
    let solvedProblemIds = new Set();

    if (userId) {
      const acceptedSubmissions = await Submission.find({ userId, status: "accepted" }).select("problemId");
      solvedProblemIds = new Set(acceptedSubmissions.map((s) => s.problemId.toString()));
    }

    const responseData = problems.map((problem) => ({
      ...problem.toObject(),
      isSolved: solvedProblemIds.has(problem._id.toString()),
    }));

    res.status(200).send(responseData);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const solvedAllProblembyUser = async (req, res) => {
  try {
    const userId = req.result._id;
    const solvedProblemIds = await Submission.distinct("problemId", { userId, status: "accepted" });

    if (!solvedProblemIds || solvedProblemIds.length === 0) return res.status(200).send([]);

    const solvedProblems = await Problem.find({ _id: { $in: solvedProblemIds }, $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }] }).select("_id title difficulty tags status");
    res.status(200).send(solvedProblems);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;
    const ans = await Submission.find({ userId, problemId });

    if (ans.length === 0) return res.status(200).send("No Submission is present");
    res.status(200).send(ans);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

// The logged-in user's submissions from the last year, newest first (for the profile page)
const getMySubmissions = async (req, res) => {
  try {
    const since = new Date();
    since.setFullYear(since.getFullYear() - 1);
    const submissions = await Submission.find({ userId: req.result._id, createdAt: { $gte: since } })
      .select("problemId status language runtime createdAt")
      .populate("problemId", "title difficulty")
      .sort({ createdAt: -1 })
      .limit(2000)
      .lean();
    res.status(200).send(submissions);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

export { getMySubmissions, createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser, submittedProblem, handleStreakAndSolved, getUserProblems, getPendingProblems };