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

// Allowed frontends: FRONTEND_URL (comma-separated for several), plus any localhost port in development
// so Vite falling back to 5174/5175 doesn't break the app
const allowedOrigins = [
    'https://algoriseaicodingplatpractice.netlify.app',
    ...(process.env.FRONTEND_URL || '').split(','),
].map((o) => o.trim().replace(/\/+$/, '')).filter(Boolean)
// This account's own Vercel deployments (production and previews)
const vercelDeploy = /^https:\/\/[a-z0-9-]+-himanshus-projects-ef8b37be\.vercel\.app$/
const isDev = process.env.NODE_ENV !== 'production'

app.use(cors({
    origin: (origin, callback) => {
        // Same-origin requests and tools like curl send no Origin header
        if (!origin || allowedOrigins.includes(origin) || vercelDeploy.test(origin) || (isDev && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))) {
            return callback(null, true)
        }
        callback(null, false)
    },
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
   const port = Number(process.env.PORT) || 4000
   const server = app.listen(port,()=>{
    console.log("Server listening at port number", port);
   })
   server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use by another program. Stop it, or set a different PORT in backend/.env (and VITE_API_URL in frontend/.env to match).`)
        process.exit(1)
    }
    throw err
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