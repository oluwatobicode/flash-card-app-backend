import { z } from "zod";

/**
 * Update user profile request body
 * Note: profilePicture comes from multer middleware, not body
 */
export const updateProfileBody = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  studyStreak: z.number().int().min(0).optional(),
  averageMastery: z.number().min(0).max(100).optional(),
  lastStudyDate: z.coerce.date().optional(),
});

// Type exports
export type UpdateProfileBody = z.infer<typeof updateProfileBody>;
