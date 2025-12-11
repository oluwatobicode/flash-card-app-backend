import { Router } from "express";
import { authController } from "../controllers";

const router = Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/google", authController.loginWithGoogle);
router.post("/validate-email", authController.validateEmail);
router.post("/send-token", authController.sendToken);
router.patch("/update-password", authController.updatePassword);

export default router;
