import { Document } from "mongoose";

/**
 * UserProfile Interface
 *
 * Stores app-specific user data that extends the Better Auth user.
 * The userId field references the Better Auth user ID (string).
 */
export interface IUserProfile extends Document {
  userId: string; // Better Auth user ID
  totalDeck: number;
  studyStreak: number;
  averageMastery: number;
  lastStudyDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
