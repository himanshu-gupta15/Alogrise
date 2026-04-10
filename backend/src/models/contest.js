import mongoose, { Schema } from "mongoose";

const contestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    problems: [
      {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true,
      },
    ],
    maxParticipants: {
      type: Number,
      default: 500,
      min: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

contestSchema.index({ startTime: 1, endTime: 1 });

const Contest = mongoose.model("contest", contestSchema);

export default Contest;
