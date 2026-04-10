// import { emit } from "../../../../14Dev 2/backend/src/models/user";
// import redisClient from "../config/redis";
// import User from "../models/user";
// import validate from "../utils/validator";

// const register=async(req,res)=>{
//     try{
//     validate(req.body);
//     const {firstName,emailId,password}=req.body ;
//     req.body.password=await bcrypt.hash(password,10);
//     req.body.role='user'

//     const user=await User.create(req.body);
//     const token=jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});
//     const reply={
//         firstName:user.firstName,
//         emailId:user.emailId,
//         _id:user._id,
//         role:user.role,
//     }


//     res.cookie('token',token,{maxAge:60*60*1000});
//     res.status(201).json({
//         user:reply,
//         message:"Login Successfully"
//     })
//     }catch(error){
//         res.status(400).send("Error:"+error)
//     }
// }

// const login =async (req,res)=>{
//     try{
//     const {emailId,password}=req.body;
//     if(!emailId)
//         throw new Error("Invalid Credentials");
//     if(!password) 
//         throw new Error ("Invalid Credentials");
//     const user=await User.findOne({emailId});
//     const match=await bcrypt.compare(password,user.password);
//     if(!match)
//         throw new Error("Invalid Credentials");
//     const reply={
//         firstName:user.firstName,
//         emailId:user.emailId,
//         _id:user._id,
//         role:user.role,
//     }

//     const token=jwt.sign({_id:user._id,emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
//     res.cookie('token',token,{maxAge:60*60*1000});
//     res.status(201).json({
//         user:reply,
//         message:"Loggin Successfully"
//     })

//  } catch(error){
//     res.status(401).send("Error",+err);
//  }
// }

// const logout=async(req,res)=>{
//     try{
//       const {token}=req.cookies;
//       const payload=jwt.decode(token);
//       await redisClient.set(`token:${token}`,'Blocked');
//       await redisClient.expireAt(`token:${token}`,payload.exp);

//       res.cookie("token",null,{expires:new Date(Date.now())});
//       res.send("Logged Out Successfully");
//     }catch(error){
//         res.status(503).send("Error:"+err);
//     }
// }

// export default {register,login,logout}

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";
import User from "../models/user.js";
import validate from "../utils/validator.js";


const register = async (req, res) => {
  try {
    validate(req.body);

    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId, role: "user" },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    res.status(201).json({
      user: {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
        role: user.role,
      },
      message: "Registered Successfully",
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password)
      throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid Credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Credentials");

    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    res.status(200).json({
      user: {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
        role: user.role,
      },
      message: "Login Successfully",
    });
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    if (redisClient.isReady) {
      await redisClient.set(`token:${token}`, "Blocked");
      await redisClient.expireAt(`token:${token}`, payload.exp);
    }

    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logged Out Successfully");
  } catch (error) {
    res.status(503).send("Error: " + error.message);
  }
};
   

const getAllUsers = async (req, res) => {
  try {
    // 1. Fetch all users from the database
    // 2. Exclude the password field for security
    const users = await User.find({}).select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // 3. Return the list of users
    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

const adminRegister=async(req,res)=>{
  try{
    validate(req.body);
    const {firstName,emailId,password}=req.body;
    req.body.password=await bcrypt.hash(password,10);

    const user=await User.create(req.body);
    const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
    res.cookie('token',token,{maxAge:60*60*1000});
    res.status(201).send("User Registered Successfully");
  }catch(err){
    res.status(400).send("Error: "+err);
  }
}

// In controllers/userAuthent.js
export const promoteUser = async (req, res) => {
    try {
        // 1. Get userId from params (Must match :userId from your router)
        const { userId } = req.params;
        console.log(userId)
        // 2. Update the user role
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { role: 'admin' }, 
            { new: true } // Returns the modified document
        );

        // 3. Handle case where ID is valid format but user doesn't exist
        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // 4. Send success response
        res.status(200).json({
            success: true,
            message: "User promoted successfully",
            user: updatedUser
        });

    } catch (err) {
        // This is what triggers the 500 error
        console.error("Promotion Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error: " + err.message 
        });
    }
};
const deleteProfile=async(req,res)=>{
  try{
    const userId=req.result._id;
    await User.findByIdAndDelete(userId);
    res.status(200).send("Deleted Successfully");


  }catch(err){
    res.status(500).send("Internal Server Error")
  }
}

export const getLeaderboard = async (req, res) => {
  try {
    // 1. Filter: Only users with role 'user'
    // 2. Sort: By XP (highest first)
    // 3. Limit: Top 50 agents
    const users = await User.find({ role: 'user' })
      .select('firstName lastName xp streak _id')
      .sort({ xp: -1 })
      .limit(50);
    
    res.status(200).json(users);
  } catch (error) {
    console.error("Leaderboard Query Error:", error);
    res.status(500).json({ message: "Unable to sync with the User Grid." });
  }
};


export { register, login, logout,adminRegister,deleteProfile,getAllUsers};

