import { Router } from "express";
import { userController } from "../controllers";
import { requireAuth } from "../middleware";

const router = Router();

// All user routes require authentication
router.use(requireAuth);

router.get("/profile", userController.getUserProfile);
router.patch("/profile", userController.updateUserProfile);

export default router;
