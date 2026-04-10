import mongoose from "mongoose";
import Contest from "../models/contest.js";
import Problem from "../models/problem.js";

const getContestStatus = (startTime, endTime) => {
  const now = new Date();
  if (now < new Date(startTime)) return "upcoming";
  if (now > new Date(endTime)) return "ended";
  return "live";
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
      return {
        ...contest,
        status: getContestStatus(contest.startTime, contest.endTime),
        participantCount: participantIds.length,
        problemCount: contest.problems?.length || 0,
        joined: userId ? participantIds.includes(userId) : false,
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

    res.status(200).json({
      ...contest,
      status: getContestStatus(contest.startTime, contest.endTime),
      participantCount: participantIds.length,
      joined: userId ? participantIds.includes(userId) : false,
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

export { createContest, getAllContests, getContestById, joinContest };
