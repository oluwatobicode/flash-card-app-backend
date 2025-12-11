import { Router } from "express";
import { studySessionController } from "../controllers";

const router = Router();

router.get("/:deckId", studySessionController.study);
router.post("/sync", studySessionController.syncStudySession);

export default router;
