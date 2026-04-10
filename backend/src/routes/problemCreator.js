import express from "express"
import { adminMiddleware } from "../middleware/adminMeddleware.js";
import { createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem } from "../controllers/userProblem.js";
import { userMiddleware } from "../middleware/userMiddleware.js";

const problemRouter=express.Router();

// create 
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem)
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem)


problemRouter.get("/problemById/:id",userMiddleware,getProblemById)
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem)
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser)
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)

export default problemRouter;