import mongoose, { Document } from "mongoose";

export interface ICard extends Document {
  question: string;
  answer: string;
  deckId: mongoose.Types.ObjectId;
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReviewDate: Date;
}
