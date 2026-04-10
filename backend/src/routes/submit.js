import express from "express"
import { userMiddleware } from "../middleware/userMiddleware.js"
import { submitCode,runcode } from "../controllers/userSubmission.js"

const submitRouter=express.Router();
submitRouter.post("/submit/:id",userMiddleware,submitCode)
submitRouter.post("/run/:id",userMiddleware,runcode)

export default submitRouter;