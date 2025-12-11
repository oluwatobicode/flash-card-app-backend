import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  totalDeck?: number;
  studyStreak?: number;
  averageMastery?: number;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (this: IUser, el: string): boolean {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  totalDeck: {
    type: Number,
    default: 0,
  },
  studyStreak: {
    type: Number,
    default: 0,
  },
  averageMastery: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
