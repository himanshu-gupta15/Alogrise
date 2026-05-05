import express from "express";
import { adminMiddleware } from "../middleware/adminMeddleware.js";
import { userMiddleware } from "../middleware/userMiddleware.js";
import {
  createInterviewPack,
  updateInterviewPack,
  deleteInterviewPack,
  getAdminInterviewPacks,
  getPublicInterviewPacks,
} from "../controllers/interviewController.js";

const interviewRouter = express.Router();

// User-facing list
interviewRouter.get("/packs", userMiddleware, getPublicInterviewPacks);

// Admin controls
interviewRouter.get("/admin/packs", adminMiddleware, getAdminInterviewPacks);
interviewRouter.post("/admin/packs", adminMiddleware, createInterviewPack);
interviewRouter.put("/admin/packs/:id", adminMiddleware, updateInterviewPack);
interviewRouter.delete("/admin/packs/:id", adminMiddleware, deleteInterviewPack);

export default interviewRouter;
