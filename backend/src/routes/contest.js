import express from "express";
import { adminMiddleware } from "../middleware/adminMeddleware.js";
import { userMiddleware } from "../middleware/userMiddleware.js";
import {
  createContest,
  getAllContests,
  getContestById,
  joinContest,
} from "../controllers/contestController.js";

const contestRouter = express.Router();

contestRouter.post("/create", adminMiddleware, createContest);
contestRouter.get("/all", userMiddleware, getAllContests);
contestRouter.get("/:id", userMiddleware, getContestById);
contestRouter.post("/join/:id", userMiddleware, joinContest);

export default contestRouter;
