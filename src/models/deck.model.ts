import mongoose, { Document, Schema } from "mongoose";

export interface IDeck extends Document {
  deckName: string;
  user: mongoose.Types.ObjectId;
  totalCards?: number;
}

const deckSchema = new Schema<IDeck>({
  deckName: {
    type: String,
    required: [true, "A deck must have a name"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A deck must belong to a user"],
  },
  totalCards: {
    type: Number,
    default: 0,
  },
});

const Deck = mongoose.model<IDeck>("Deck", deckSchema);
export default Deck;
