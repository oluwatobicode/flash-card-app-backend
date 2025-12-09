const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: string,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
