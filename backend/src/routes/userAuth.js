import express from "express"

const authRouter=express.Router()
import { register,login,logout, adminRegister, deleteProfile, getAllUsers, promoteUser, getUserProfile, updateMyProfile, toggleFollowUser, googleLogin } from "../controllers/userAuthent.js"
import { userMiddleware } from "../middleware/userMiddleware.js"
import { adminMiddleware } from "../middleware/adminMeddleware.js"
import { getLeaderboard } from "../controllers/userAuthent.js"

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/google-auth', googleLogin)
authRouter.post('/logout',userMiddleware,logout)
authRouter.get('/getleaderboard',userMiddleware,getLeaderboard)
authRouter.get('/profile/:userId', userMiddleware, getUserProfile)
authRouter.put('/profile', userMiddleware, updateMyProfile)
authRouter.post('/follow/:userId', userMiddleware, toggleFollowUser)
authRouter.post('/admin/promote/:userId',adminMiddleware,promoteUser);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile)
authRouter.get('/admin/users',adminMiddleware,getAllUsers)
authRouter.get('/check', userMiddleware, (req, res) => {
    // You need to include the new gamification fields here!
    const reply = {
        firstName: req.result.firstName,
        emailId: req.result.emailId,
        _id: req.result._id,
        role: req.result.role,
        lastName: req.result.lastName || '',
        profilePicture: req.result.profilePicture || '',
        githubLink: req.result.githubLink || '',
        linkedinLink: req.result.linkedinLink || '',
        bio: req.result.bio || '',
        // Add these lines:
        streak: req.result.streak || 0,
        globalRank: req.result.globalRank || 0,
        xp: req.result.xp || 0,
        followersCount: req.result.followers?.length || 0,
        followingCount: req.result.following?.length || 0,
        problemSolvedCount: req.result.problemSolved?.length || 0
    }
    
    res.status(200).json({
        user: reply,
        message: "Valid User"
    });
})

export default authRouter;