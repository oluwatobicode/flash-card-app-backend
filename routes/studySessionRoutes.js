const StudySessionController = require("../controllers/studySessionController");
const express = require("express");

const router = express.Router();

router.get("/deckId", StudySessionController.Study);
router.post("/sync", StudySessionController.SyncStudySession);

module.exports = router;
