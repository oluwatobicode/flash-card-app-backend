const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deck",
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  reviewedCards: [
    {
      cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
      userGrade: {
        type: String,
        enum: ["easy", "good", "hard", "again"],
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

const StudySession = mongoose.model("StudySession", studySessionSchema);
module.exports = StudySession;
