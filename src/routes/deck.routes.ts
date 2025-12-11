import { Router } from "express";
import { deckController } from "../controllers";
import { requireAuth, singlePdfUpload } from "../middleware";
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
router.post(
  "/",
  validate({
    body: createDeckBody,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  deckController.createDeck,
);

router.get(
  "/",
  validate({
    body: emptyObjectSchema,
    params: emptyObjectSchema,
    query: optionalPaginationSchema,
  }),
  deckController.getAllDecks,
);

router.get(
  "/:id",
  validate({
    body: emptyObjectSchema,
    params: idParamSchema,
    query: emptyObjectSchema,
  }),
  deckController.getDeckById,
);

router.patch(
  "/:id",
  validate({
    body: updateDeckBody,
    params: idParamSchema,
    query: emptyObjectSchema,
  }),
  deckController.updateDeckById,
);

router.delete(
  "/:id",
  validate({
    body: emptyObjectSchema,
    params: idParamSchema,
    query: emptyObjectSchema,
  }),
  deckController.deleteDeck,
);

// AI-powered deck generation from PDF
router.post(
  "/generate-ai",
  singlePdfUpload,
  validate({
    body: generateAIDeckBody,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  deckController.generateAIDeck,
);

export default router;
