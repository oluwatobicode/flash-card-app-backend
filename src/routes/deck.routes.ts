import { Router } from "express";
import { deckController } from "../controllers";

const router = Router();

router.post("/", deckController.createDeck);
router.delete("/:id", deckController.deleteDeck);
router.get("/", deckController.getAllDecks);
router.get("/:id", deckController.getDeckById);
router.patch("/:id", deckController.updateDeckById);

export default router;
