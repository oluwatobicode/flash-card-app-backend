import mongoose, { Schema } from "mongoose";
import { IDeck } from "../interfaces";

const deckSchema = new Schema<IDeck>(
  {
    deckName: {
      type: String,
      required: [true, "A deck must have a name"],
    },
    userId: {
      type: String,
      required: [true, "A deck must belong to a user"],
      index: true,
    },
    totalCards: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Deck = mongoose.model<IDeck>("Deck", deckSchema);
export default Deck;
