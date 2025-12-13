import { Router } from "express";
import { userController } from "../controllers";
import { requireAuth, singleImageUpload } from "../middleware";
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
  singleImageUpload,
  validate({
    body: updateProfileBody,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  userController.updateUserProfile,
);

router.get(
  "/dashboard-stats",
  validate({
    body: emptyObjectSchema,
    params: emptyObjectSchema,
    query: emptyObjectSchema,
  }),
  userController.getDashboardStats,
);

export default router;
