const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

router.get("/profile", UserController.getUserProfile);
router.patch("/profile", UserController.updateUserProfile);

module.exports = router;
