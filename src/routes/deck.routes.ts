import { Router } from "express";
import { deckController } from "../controllers";
import { requireAuth, singlePdfUpload } from "../middleware";

const router = Router();

// All deck routes require authentication
router.use(requireAuth);

// Standard CRUD routes
router.post("/", deckController.createDeck);
router.get("/", deckController.getAllDecks);
router.get("/:id", deckController.getDeckById);
router.patch("/:id", deckController.updateDeckById);
router.delete("/:id", deckController.deleteDeck);

// AI-powered deck generation from PDF
router.post("/generate-ai", singlePdfUpload, deckController.generateAIDeck);

export default router;
