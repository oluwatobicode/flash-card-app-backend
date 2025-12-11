import mongoose, { Document } from "mongoose";

export interface IReviewedCard {
  cardId: mongoose.Types.ObjectId;
  userGrade: "easy" | "good" | "hard" | "again";
  timeSpent?: number;
  timeStamp: Date;
}

export interface IStudySession extends Document {
  userId: string; // Better Auth user ID
  deckId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  reviewedCards: IReviewedCard[];
}
