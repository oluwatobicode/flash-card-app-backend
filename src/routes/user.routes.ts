import { Router } from "express";
import { userController } from "../controllers";

const router = Router();

router.get("/profile", userController.getUserProfile);
router.patch("/profile", userController.updateUserProfile);

export default router;
