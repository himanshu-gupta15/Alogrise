import mongoose from "mongoose";

const { Schema } = mongoose;

const interviewPackSchema = new Schema(
  {
    packId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["online", "phone", "onsite"],
      required: true,
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    attempted: {
      type: Number,
      default: 0,
      min: 0,
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    priceInCents: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "usd",
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 600,
    },
    problems: [
      {
        type: Schema.Types.ObjectId,
        ref: "problem",
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

interviewPackSchema.index({ type: 1, isActive: 1 });

const InterviewPack = mongoose.model("interviewPack", interviewPackSchema);

export default InterviewPack;
