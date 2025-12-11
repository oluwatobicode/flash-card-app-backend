import { Router } from "express";
import { studySessionController } from "../controllers";
import { requireAuth } from "../middleware";
import {
  validate,
  emptyObjectSchema,
  studyDeckParams,
  syncSessionBody,
} from "../validators";

const router = Router();

// All study routes require authentication
router.use(requireAuth);

router.get(
  "/:deckId",
  validate({
    body: emptyObjectSchema,
    params: studyDeckParams,
    query: emptyObjectSchema,
  }),
  studySessionController.study,
);

router.post(
  "/sync",
  validate({
    body: syncSessionBody,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  studySessionController.syncStudySession,
);

export default router;
