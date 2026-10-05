import express from "express"
import { adminMiddleware } from "../middleware/adminMeddleware.js";
import { createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem, getUserProblems, getPendingProblems, getMySubmissions } from "../controllers/userProblem.js";
import { userMiddleware } from "../middleware/userMiddleware.js";

const problemRouter=express.Router();

// create (users can submit problems; admin approves)
problemRouter.post("/create",userMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem)
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem)


problemRouter.get("/problemById/:id",userMiddleware,getProblemById)
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem)
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser)
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)
// fetch problems created by the logged-in user
problemRouter.get("/myProblems",userMiddleware,getUserProblems)
// the logged-in user's recent submissions (profile heatmap + history)
problemRouter.get("/mySubmissions",userMiddleware,getMySubmissions)
// admin: fetch pending problems for review
problemRouter.get("/pending",adminMiddleware,getPendingProblems)

export default problemRouter;