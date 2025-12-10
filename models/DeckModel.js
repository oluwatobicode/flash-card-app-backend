const mongoose = require("mongoose");

const deckSchema = new mongoose.Schema({
  deckName: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalCards: {
    type: Number,
  },
});

const Deck = mongoose.model("Deck", deckSchema);
module.exports = Deck;
