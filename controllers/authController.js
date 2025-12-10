const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

exports.signUp = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.login = async () => {};

exports.logout = async () => {};

exports.protect = async () => {};

exports.loginWithGoogle = async () => {};

exports.validateEmail = asyncHandler(async (req, res) => {});
exports.sendToken = asyncHandler(async (req, res) => {});
exports.updatePassword = asyncHandler(async (req, res) => {});
