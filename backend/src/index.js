import "dotenv/config";  
import express from "express"
import cors from "cors"
import main from "./config/db.js"
import redisClient, { isRedisConfigured } from "./config/redis.js"
import authRouter from "./routes/userAuth.js";
import cookieParser from "cookie-parser";
import problemRouter from "./routes/problemCreator.js";
import submitRouter from "./routes/submit.js";
import aiRouter from "./routes/aiChatting.js";
import videoRouter from "./routes/videoCreator.js";
import contestRouter from "./routes/contest.js";
import paymentRouter from "./routes/payment.js";
import interviewRouter from "./routes/interview.js";
const app=express()

app.use(cors({
    origin:'https://algoriseaicodingplatpractice.netlify.app',
    credentials:true 
}))

app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true, limit: '15mb' }))
app.use(cookieParser())
app.use('/user',authRouter)
app.use('/problem',problemRouter)
app.use('/submission',submitRouter)
app.use('/ai',aiRouter)
app.use("/video",videoRouter)
app.use("/contest",contestRouter)
app.use('/payment', paymentRouter)
app.use('/interview', interviewRouter)


console.log("PORT:",process.env.PORT)
const InitalizeConnection=async()=>{
   app.listen(process.env.PORT,()=>{
    console.log("Sever listening at port number",+process.env.PORT);
   })

   try {
    await main();
    console.log("DB Connected");
   } catch (err) {
    console.error("MongoDB connection failed:", err?.message || err);
   }

     if (!isRedisConfigured) {
        console.warn("Redis not configured (set REDIS_URL or REDIS_HOST). Continuing without Redis.");
        return;
     }

     try {
        await redisClient.connect();
     } catch (err) {
        if (err?.code === "ENOTFOUND") {
            console.error("Redis host not found. Verify REDIS_HOST/REDIS_URL in .env.");
        }
        console.error("Redis connection failed, continuing without Redis:", err?.message || err);
     }
}

InitalizeConnection()
