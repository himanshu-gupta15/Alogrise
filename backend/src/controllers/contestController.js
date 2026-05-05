import mongoose from "mongoose";
import Contest from "../models/contest.js";
import Problem from "../models/problem.js";

const getContestStatus = (startTime, endTime) => {
  const now = new Date();
  if (now < new Date(startTime)) return "upcoming";
  if (now > new Date(endTime)) return "ended";
  return "live";
};

const getContestDurationMs = (startTime, endTime) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.max(0, end - start);
};

const createContest = async (req, res) => {
  try {
    const { title, description, startTime, endTime, problems, maxParticipants } = req.body;

    if (!title || !description || !startTime || !endTime || !Array.isArray(problems) || problems.length === 0) {
      return res.status(400).send("Missing required contest fields");
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return res.status(400).send("Invalid start/end date format");
    }

    if (endDate <= startDate) {
      return res.status(400).send("Contest end time must be after start time");
    }

    const validProblemIds = problems.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validProblemIds.length !== problems.length) {
      return res.status(400).send("One or more problem IDs are invalid");
    }

    const problemCount = await Problem.countDocuments({ _id: { $in: validProblemIds } });
    if (problemCount !== validProblemIds.length) {
      return res.status(404).send("One or more problems were not found");
    }

    const contest = await Contest.create({
      title,
      description,
      startTime: startDate,
      endTime: endDate,
      problems: validProblemIds,
      maxParticipants: maxParticipants || 500,
      createdBy: req.result._id,
    });

    res.status(201).json({ message: "Contest created successfully", contest });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find({})
      .select("title description startTime endTime maxParticipants participants problems")
      .sort({ startTime: 1 })
      .lean();

    const userId = req.result?._id?.toString();

    const response = contests.map((contest) => {
      const participantIds = contest.participants?.map((id) => id.toString()) || [];
      const joined = userId ? participantIds.includes(userId) : false;
      const status = getContestStatus(contest.startTime, contest.endTime);

      return {
        ...contest,
        status,
        participantCount: participantIds.length,
        problemCount: contest.problems?.length || 0,
        joined,
        canStartVirtual: status === "ended" && !joined,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getContestById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid contest ID");
    }

    const contest = await Contest.findById(id)
      .populate("problems", "_id title difficulty tags")
      .populate("createdBy", "_id firstName emailId")
      .lean();

    if (!contest) {
      return res.status(404).send("Contest not found");
    }

    const participantIds = contest.participants?.map((pid) => pid.toString()) || [];
    const userId = req.result?._id?.toString();
    const joined = userId ? participantIds.includes(userId) : false;
    const status = getContestStatus(contest.startTime, contest.endTime);

    res.status(200).json({
      ...contest,
      status,
      participantCount: participantIds.length,
      joined,
      canStartVirtual: status === "ended" && !joined,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const joinContest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.result._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid contest ID");
    }

    const contest = await Contest.findById(id);
    if (!contest) {
      return res.status(404).send("Contest not found");
    }

    const status = getContestStatus(contest.startTime, contest.endTime);
    if (status === "ended") {
      return res.status(400).send("Contest has already ended");
    }

    // Disallow joining before contest start
    if (status === "upcoming") {
      return res.status(400).send("Contest has not started yet");
    }

    const alreadyJoined = contest.participants.some((pid) => pid.toString() === userId.toString());
    if (alreadyJoined) {
      return res.status(200).json({ message: "Already joined this contest" });
    }

    if (contest.participants.length >= contest.maxParticipants) {
      return res.status(400).send("Contest is full");
    }

    contest.participants.push(userId);
    await contest.save();

    res.status(200).json({ message: "Joined contest successfully" });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const startVirtualContest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.result._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid contest ID");
    }

    const contest = await Contest.findById(id)
      .select("title description startTime endTime problems participants")
      .lean();

    if (!contest) {
      return res.status(404).send("Contest not found");
    }

    const status = getContestStatus(contest.startTime, contest.endTime);
    if (status !== "ended") {
      return res.status(400).send("Virtual contest is available only after contest ends");
    }

    const alreadyParticipated = contest.participants?.some(
      (participantId) => participantId.toString() === userId.toString()
    );

    if (alreadyParticipated) {
      return res.status(400).send("You already participated in the live contest");
    }

    const durationMs = getContestDurationMs(contest.startTime, contest.endTime);
    const virtualStartTime = new Date();
    const virtualEndTime = new Date(virtualStartTime.getTime() + durationMs);

    return res.status(200).json({
      message: "Virtual contest started",
      virtualContest: {
        contestId: contest._id,
        title: contest.title,
        description: contest.description,
        problems: contest.problems,
        durationMinutes: Math.ceil(durationMs / 60000),
        virtualStartTime,
        virtualEndTime,
      },
    });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

export { createContest, getAllContests, getContestById, joinContest, startVirtualContest };
