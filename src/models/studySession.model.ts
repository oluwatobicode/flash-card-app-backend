import mongoose, { Schema } from "mongoose";
import { IStudySession } from "../interfaces";

const studySessionSchema = new Schema<IStudySession>({
  userId: {
    type: String,
    required: [true, "A study session must belong to a user"],
    index: true,
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
