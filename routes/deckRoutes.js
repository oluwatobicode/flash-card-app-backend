const Decks = require("../controllers/deckController");
const express = require("express");

const router = express.Router();

router.post("/", Decks.createDeck);
router.delete("/:id", Decks.DeleteDeck);
router.get("/", Decks.getAllDecks);
router.get("/:id", Decks.getDeckById);
router.patch("/:id", Decks.updateDeckById);

module.exports = router;
