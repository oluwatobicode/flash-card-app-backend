import mongoose, { Schema } from "mongoose";
import { IUserProfile } from "../interfaces";

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalDeck: {
      type: Number,
      default: 0,
    },
    studyStreak: {
      type: Number,
      default: 0,
    },
    averageMastery: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastStudyDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const UserProfile = mongoose.model<IUserProfile>(
  "UserProfile",
  userProfileSchema,
);

export default UserProfile;
