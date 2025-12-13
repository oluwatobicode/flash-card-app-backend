import { Router } from "express";
import { cardController } from "../controllers";
import { requireAuth, aiLimiter } from "../middleware";
import {
  validate,
  emptyObjectSchema,
  idParamSchema,
  createCardBody,
  updateCardBody,
  askAiAboutCardBody,
} from "../validators";

const router = Router();

// All card routes require authentication
router.use(requireAuth);

router.post(
  "/",
  validate({
    body: createCardBody,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  cardController.createCard,
);

router.patch(
  "/:id",
  validate({
    body: updateCardBody,
    params: idParamSchema,
    query: emptyObjectSchema,
  }),
  cardController.updateCardById,
);

router.delete(
  "/:id",
  validate({
    body: emptyObjectSchema,
    params: idParamSchema,
    query: emptyObjectSchema,
  }),
  cardController.deleteCard,
);

// asking ai about a card (with AI rate limiting)
router.post(
  "/ask-ai",
  aiLimiter,
  validate({
    body: askAiAboutCardBody,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  cardController.askAiAboutCard,
);

export default router;
