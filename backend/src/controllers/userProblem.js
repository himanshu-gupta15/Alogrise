import { getLanguageById, submitBatch, submitToken } from "../utils/problemUtility.js";
import Problem from "../models/problem.js";
import User from "../models/user.js";
import Submission from "../models/submission.js";
import SolutionVideo from "../models/solutionVideo.js";

/* ================= UTILITY FUNCTIONS ================= */

/**
 * Recalculates and updates the global rank for all users based on XP.
 */
const updateGlobalRank = async () => {
  try {
    const users = await User.find({}).sort({ xp: -1 });
    const updatePromises = users.map((user, index) => {
      return User.findByIdAndUpdate(user._id, { globalRank: index + 1 });
    });
    await Promise.all(updatePromises);
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

  await User.findByIdAndUpdate(userId, {
    $addToSet: { problemSolved: problemId },
    $set: {
      streak: newStreak,
      lastSolvedDate: now,
    },
    $inc: { xp: 10 },
  });

  await updateGlobalRank();
};

/* ================= CORE CONTROLLERS ================= */

const createProblem = async (req, res) => {
  const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      const normalizedCode = completeCode.replace(/\\n/g, "\n");

      const submissions = visibleTestCases.map((testcase) => ({
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

    await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    res.status(201).send("Problem Saved Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(400).send("Missing ID Field");

    const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
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
    const getProblem = await Problem.findById(id).select("_id title description difficulty tags visibleTestCases startCode referenceSolution ");
    if (!getProblem) return res.status(404).send("Problem is Missing");

    const videos = await SolutionVideo.findOne({ problemId: id });
    const responseData = videos
      ? { ...getProblem.toObject(), secureUrl: videos.secureUrl, thumbnailUrl: videos.thumbnailUrl, duration: videos.duration }
      : getProblem;

    res.status(200).send(responseData);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const problems = await Problem.find({}).select("_id title difficulty tags");
    if (!problems || problems.length === 0) return res.status(404).send("Problem is Missing");

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

    const solvedProblems = await Problem.find({ _id: { $in: solvedProblemIds } }).select("_id title difficulty tags");
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

export { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser, submittedProblem, handleStreakAndSolved };