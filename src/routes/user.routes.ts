import { Router } from "express";
import { userController } from "../controllers";
import { requireAuth } from "../middleware";
import { validate, emptyObjectSchema, updateProfileBody } from "../validators";

const router = Router();

// All user routes require authentication
router.use(requireAuth);

router.get(
  "/profile",
  validate({
    body: emptyObjectSchema,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  userController.getUserProfile,
);

router.patch(
  "/profile",
  validate({
    body: updateProfileBody,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  userController.updateUserProfile,
);

export default router;
