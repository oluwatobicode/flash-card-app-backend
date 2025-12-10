const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "A card must have a question"],
  },
  answer: {
    type: String,
    required: [true, "A card must have an answer"],
  },
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deck",
    required: [true, "A card must belong to a deck"],
  },
  //   user: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: [true, "A card must belong to a user"],
  //   },

  // tjis sare for the SRS / spaced repetition fields
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

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
