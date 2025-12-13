import { Router } from "express";
import { deckController } from "../controllers";
import { requireAuth, singlePdfUpload, aiLimiter } from "../middleware";
import {
  validate,
  emptyObjectSchema,
  idParamSchema,
  optionalPaginationSchema,
  createDeckBody,
  updateDeckBody,
  generateAIDeckBody,
} from "../validators";

const router = Router();

// All deck routes require authentication
router.use(requireAuth);

// Standard CRUD routes

// create a deck
router.post(
  "/",
  validate({
    body: createDeckBody,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  deckController.createDeck,
);

// get all decks
router.get(
  "/",
  validate({
    body: emptyObjectSchema,
    params: emptyObjectSchema,
    query: optionalPaginationSchema,
  }),
  deckController.getAllDecks,
);

// get specific details about a specific deck
router.get(
  "/:id",
  validate({
    body: emptyObjectSchema,
    params: idParamSchema,
    query: emptyObjectSchema,
  }),
  deckController.getDeckById,
);

// updating a card
router.patch(
  "/:id",
  validate({
    body: updateDeckBody,
    params: idParamSchema,
    query: emptyObjectSchema,
  }),
  deckController.updateDeckById,
);

// deleting a specific deck
router.delete(
  "/:id",
  validate({
    body: emptyObjectSchema,
    params: idParamSchema,
    query: emptyObjectSchema,
  }),
  deckController.deleteDeck,
);

// AI-powered deck generation from PDF (with AI rate limiting)
router.post(
  "/generate-ai",
  aiLimiter,
  singlePdfUpload,
  validate({
    body: generateAIDeckBody,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  deckController.generateAIDeck,
);

// getting a specific deck with its card
router.get(
  "/:id/cards",
  validate({
    params: idParamSchema,
  }),
  deckController.studyDecks,
);

export default router;
