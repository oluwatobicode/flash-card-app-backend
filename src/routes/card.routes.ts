import { Router } from "express";
import { cardController } from "../controllers";
import { requireAuth } from "../middleware";
import {
  validate,
  emptyObjectSchema,
  idParamSchema,
  createCardBody,
  updateCardBody,
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

export default router;
