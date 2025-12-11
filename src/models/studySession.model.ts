import mongoose, { Document, Schema } from "mongoose";

interface IReviewedCard {
  cardId: mongoose.Types.ObjectId;
  userGrade: "easy" | "good" | "hard" | "again";
  timeSpent?: number;
  timeStamp: Date;
}

export interface IStudySession extends Document {
  user: mongoose.Types.ObjectId;
  deckId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  reviewedCards: IReviewedCard[];
}

const studySessionSchema = new Schema<IStudySession>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A study session must belong to a user"],
  },
  deckId: {
    type: Schema.Types.ObjectId,
    ref: "Deck",
    required: [true, "A study session must be associated with a deck"],
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  reviewedCards: [
    {
      cardId: {
        type: Schema.Types.ObjectId,
        ref: "Card",
        required: true,
      },
      userGrade: {
        type: String,
        enum: ["easy", "good", "hard", "again"],
        required: true,
      },
      timeSpent: {
        type: Number, // time in seconds
      },
      timeStamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const StudySession = mongoose.model<IStudySession>(
  "StudySession",
  studySessionSchema,
);
export default StudySession;
