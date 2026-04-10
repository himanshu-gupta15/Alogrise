import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        default: "",
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    age: {
        type: Number,
        min: 6,
        max: 80,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // References to problems solved
    problemSolved: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'problem' // Ensure this matches your Problem model name
        }],
        default: []
    },
    // NEW: Fields for Profile Stats
    streak: {
        type: Number,
        default: 0
    },
    lastSolvedDate: {
        type: Date,
        default: null
    },
    globalRank: {
        type: Number,
        default: 0 // You can update this via a background job or based on XP
    },
    xp: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    resetOtp: {
        type: String,
        default: undefined
    },
    otpExpires: {
        type: Date,
        default: undefined 
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

// Middleware to clean up submissions when a user is deleted
userSchema.post('findOneAndDelete', async function (userInfo) {
    if (userInfo) {
        await mongoose.model('subission').deleteMany({ userId: userInfo._id });
    }
});

const User = mongoose.model("user", userSchema);

export default User;