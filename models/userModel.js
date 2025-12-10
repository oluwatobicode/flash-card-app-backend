const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    // required: [true, "Your email must be valid"],
  },
  password: {
    type: String,
    // required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  totalDeck: {
    type: Number,
  },
  studyStreak: {
    type: Number,
  },
  averageMastery: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
