import express from "express"
import { userMiddleware } from "../middleware/userMiddleware.js"
import solveDoubt from "../controllers/solveDoubt.js"

const aiRouter=express.Router()

aiRouter.post("/chat",userMiddleware,solveDoubt)

export default aiRouter