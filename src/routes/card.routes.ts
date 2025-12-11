import { Router } from "express";
import { cardController } from "../controllers";

const router = Router();

router.post("/", cardController.createCard);
router.delete("/:id", cardController.deleteCard);
router.patch("/:id", cardController.updateCardById);

export default router;
