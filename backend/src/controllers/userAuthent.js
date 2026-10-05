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
import axios from "axios";
import redisClient from "../config/redis.js";
import User from "../models/user.js";
import validate from "../utils/validator.js";

// Session cookie: httpOnly so page scripts (and XSS) can't read the token
const COOKIE_OPTIONS = { maxAge: 60 * 60 * 1000, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" };

// First names must be 3–20 characters (see the user model)
const fitFirstName = (...candidates) => {
  const name = candidates.map((c) => (c || "").trim()).find((c) => c.length >= 3) || "Coder";
  return name.slice(0, 20);
};

const buildPublicUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  emailId: user.emailId,
  role: user.role,
  profilePicture: user.profilePicture || '',
  githubLink: user.githubLink || '',
  linkedinLink: user.linkedinLink || '',
  bio: user.bio || '',
  streak: user.streak || 0,
  globalRank: user.globalRank || 0,
  xp: user.xp || 0,
  followersCount: user.followers?.length || 0,
  followingCount: user.following?.length || 0,
  problemSolvedCount: user.problemSolved?.length || 0,
  createdAt: user.createdAt,
  followers: (user.followers || []).map((follower) => ({
    _id: follower._id,
    firstName: follower.firstName,
    lastName: follower.lastName,
    profilePicture: follower.profilePicture || '',
    githubLink: follower.githubLink || '',
    linkedinLink: follower.linkedinLink || '',
  })),
  following: (user.following || []).map((followedUser) => ({
    _id: followedUser._id,
    firstName: followedUser.firstName,
    lastName: followedUser.lastName,
    profilePicture: followedUser.profilePicture || '',
    githubLink: followedUser.githubLink || '',
    linkedinLink: followedUser.linkedinLink || '',
  })),
});


const register = async (req, res) => {
  try {
    validate(req.body);

    const { firstName, lastName, emailId, password } = req.body;

    // Only accept known signup fields so clients can't set role, xp, rank, etc.
    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: await bcrypt.hash(password, 10),
      role: "user",
    });

    const token = jwt.sign(
      { _id: user._id, emailId, role: "user" },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        _id: user._id,
        role: user.role,
        profilePicture: user.profilePicture || '',
        githubLink: user.githubLink || '',
        linkedinLink: user.linkedinLink || '',
        bio: user.bio || '',
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        streak: user.streak || 0,
        globalRank: user.globalRank || 0,
        xp: user.xp || 0,
        problemSolvedCount: user.problemSolved?.length || 0,
      },
      message: "Registered Successfully",
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).send("Error: An account with this email already exists. Sign in instead.");
    }
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
    if (!user.password) throw new Error("This account uses Google sign-in. Continue with Google instead.");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Credentials");

    const token = jwt.sign(
      { _id: user._id, emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        _id: user._id,
        role: user.role,
        profilePicture: user.profilePicture || '',
        githubLink: user.githubLink || '',
        linkedinLink: user.linkedinLink || '',
        bio: user.bio || '',
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        streak: user.streak || 0,
        globalRank: user.globalRank || 0,
        xp: user.xp || 0,
        problemSolvedCount: user.problemSolved?.length || 0,
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

    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: COOKIE_OPTIONS.secure });
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
    res.cookie('token',token,COOKIE_OPTIONS);
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
    await User.updateMany({}, { $pull: { followers: userId, following: userId } });
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
      .select('firstName lastName xp streak profilePicture problemSolved _id')
      .sort({ xp: -1, _id: 1 })
      .limit(50)
      .lean();

    // Send a count instead of the whole solved-problem list
    res.status(200).json(
      users.map(({ problemSolved, ...user }) => ({ ...user, problemSolvedCount: problemSolved?.length || 0 }))
    );
  } catch (error) {
    console.error("Leaderboard Query Error:", error);
    res.status(500).json({ message: "Unable to sync with the User Grid." });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.result?._id?.toString();

    const profileUser = await User.findById(userId)
      .select('-password')
      .populate('followers', 'firstName lastName profilePicture githubLink linkedinLink')
      .populate('following', 'firstName lastName profilePicture githubLink linkedinLink');

    if (!profileUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = viewerId
      ? profileUser.followers.some((follower) => follower._id.toString() === viewerId)
      : false;

    res.status(200).json({
      user: {
        ...buildPublicUser(profileUser.toObject()),
        isFollowing,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load profile', error: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    const { firstName, lastName, profilePicture, githubLink, linkedinLink, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(firstName !== undefined ? { firstName } : {}),
        ...(lastName !== undefined ? { lastName } : {}),
        ...(profilePicture !== undefined ? { profilePicture } : {}),
        ...(githubLink !== undefined ? { githubLink } : {}),
        ...(linkedinLink !== undefined ? { linkedinLink } : {}),
        ...(bio !== undefined ? { bio } : {}),
      },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('followers', 'firstName lastName profilePicture githubLink linkedinLink')
      .populate('following', 'firstName lastName profilePicture githubLink linkedinLink');

    res.status(200).json({ user: buildPublicUser(updatedUser.toObject()), message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update profile', error: error.message });
  }
};

export const toggleFollowUser = async (req, res) => {
  try {
    const viewerId = req.result._id.toString();
    const { userId } = req.params;

    if (viewerId === userId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(userId);
    const viewer = await User.findById(viewerId);

    if (!targetUser || !viewer) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = viewer.following.some((followedId) => followedId.toString() === userId);

    if (isFollowing) {
      await User.updateOne({ _id: viewerId }, { $pull: { following: userId } });
      await User.updateOne({ _id: userId }, { $pull: { followers: viewerId } });
    } else {
      await User.updateOne({ _id: viewerId }, { $addToSet: { following: userId } });
      await User.updateOne({ _id: userId }, { $addToSet: { followers: viewerId } });
    }

    const updatedTarget = await User.findById(userId)
      .select('-password')
      .populate('followers', 'firstName lastName profilePicture githubLink linkedinLink')
      .populate('following', 'firstName lastName profilePicture githubLink linkedinLink');

    res.status(200).json({
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      user: {
        ...buildPublicUser(updatedTarget.toObject()),
        isFollowing: !isFollowing,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update follow state', error: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken || typeof accessToken !== "string") {
      return res.status(400).json({ message: "Access token is required" });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("GOOGLE_CLIENT_ID is not set; refusing Google sign-in.");
      return res.status(500).json({ message: "Google sign-in is not configured on the server" });
    }

    // 1. The token must have been issued to *our* client, not any app the user signed into
    let tokenInfo;
    try {
      ({ data: tokenInfo } = await axios.get("https://oauth2.googleapis.com/tokeninfo", { params: { access_token: accessToken } }));
    } catch {
      return res.status(401).json({ message: "Google sign-in expired or was invalid. Please try again." });
    }
    if (tokenInfo.aud !== clientId && tokenInfo.azp !== clientId) {
      return res.status(401).json({ message: "This Google token wasn't issued for Algorise" });
    }

    // 2. Profile, with the token in a header rather than the URL
    const { data: googleUser } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!googleUser.email || googleUser.email_verified === false) {
      return res.status(401).json({ message: "Your Google account's email isn't verified" });
    }

    const { email, given_name, family_name, name, picture } = googleUser;
    const emailId = email.toLowerCase();

    let user = await User.findOne({ emailId });

    if (!user) {
      user = await User.create({
        firstName: fitFirstName(given_name, name, emailId.split("@")[0]),
        lastName: family_name || "",
        emailId,
        profilePicture: picture || "",
        role: "user",
      });
    }

    // Create a JWT token
    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // Set cookie
    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        _id: user._id,
        role: user.role,
        profilePicture: user.profilePicture || '',
        githubLink: user.githubLink || '',
        linkedinLink: user.linkedinLink || '',
        bio: user.bio || '',
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
        streak: user.streak || 0,
        globalRank: user.globalRank || 0,
        xp: user.xp || 0,
        problemSolvedCount: user.problemSolved?.length || 0,
      },
      message: "Google Login Successful",
    });
  } catch (error) {
    console.error("Google sign-in failed:", error?.response?.data || error.message);
    res.status(500).json({ message: "Google sign-in failed. Please try again." });
  }
};

export { register, login, logout,adminRegister,deleteProfile,getAllUsers, googleLogin};

