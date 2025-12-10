const express = require("express");
const CardController = require("../controllers/cardController");

const router = express.Router();

router.post("/", CardController.createCard);
router.delete("/:id", CardController.deleteCard);
router.patch("/:id", CardController.updateCardById);

module.exports = router;
