import mongoose, { Document, Schema } from "mongoose";

export interface ICard extends Document {
  question: string;
  answer: string;
  deckId: mongoose.Types.ObjectId;
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReviewDate: Date;
}

const cardSchema = new Schema<ICard>({
  question: {
    type: String,
    required: [true, "A card must have a question"],
  },
  answer: {
    type: String,
    required: [true, "A card must have an answer"],
  },
  deckId: {
    type: Schema.Types.ObjectId,
    ref: "Deck",
    required: [true, "A card must belong to a deck"],
  },
  // Spaced Repetition System (SRS) fields
  easeFactor: {
    type: Number,
    default: 2.5,
  },
  interval: {
    type: Number,
    default: 0,
  },
  repetition: {
    type: Number,
    default: 0,
  },
  nextReviewDate: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model<ICard>("Card", cardSchema);
export default Card;
