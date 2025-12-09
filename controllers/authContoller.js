const User = require("../models/userModel");

exports.signUp = async (req, res) => {
  const user = await User.create({
    username: req.body.username,
  });
};
