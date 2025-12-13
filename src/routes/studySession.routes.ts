import { Router } from "express";
import { studySessionController } from "../controllers";
import { requireAuth, aiLimiter } from "../middleware";
import {
  validate,
  emptyObjectSchema,
  studyDeckParams,
  syncSessionBody,
  sessionHistoryQuery,
  sessionIdParams,
} from "../validators";

const router = Router();

// All study routes require authentication
router.use(requireAuth);

router.get(
  "/sessions",
  validate({
    body: emptyObjectSchema,
    params: emptyObjectSchema,
    query: sessionHistoryQuery,
  }),
  studySessionController.getSessionHistory,
);

router.get(
  "/sessions/:id/report",
  aiLimiter,
  validate({
    body: emptyObjectSchema,
    params: sessionIdParams,
    query: emptyObjectSchema,
  }),
  studySessionController.getSessionReport,
);

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
