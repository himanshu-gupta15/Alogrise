import jwt from "jsonwebtoken"
import User from "../models/user.js"
import redisClient from "../config/redis.js"

const adminMiddleware=async (req,res,next)=>{
    try{
     const {token}=req.cookies;
     if(!token){
        throw new Error("Token is not present");}
        const payload=jwt.verify(token,process.env.JWT_KEY);
        const {_id}=payload;
        if(!_id){
            throw new Error("Invalid token");

        }
        const result=await User.findById(_id);
        if(payload.role!='admin'){
            throw new Error("Invalid Token");

        }
        if(!result){
            throw new Error("User Doesn't Exist")
        }
        let IsBlocked=0;
        if(redisClient.isReady){
            IsBlocked=await redisClient.exists(`token:${token}`);
        }
        if(IsBlocked){
            throw new Error("Invalid Token");
        }
        req.result=result;
        next();
     
    }catch(err){
        res.status(401).send("Error: "+err.message)
    }
}

export {adminMiddleware};