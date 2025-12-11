import { Document } from "mongoose";

export interface IDeck extends Document {
  deckName: string;
  userId: string; // Better Auth user ID
  totalCards?: number;
  createdAt: Date;
  updatedAt: Date;
}
