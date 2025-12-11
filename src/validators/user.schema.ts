import { z } from "zod";

/**
 * Update user profile request body
 */
export const updateProfileBody = z.object({
  studyStreak: z.number().int().min(0).optional(),
  averageMastery: z.number().min(0).max(100).optional(),
  lastStudyDate: z.coerce.date().optional(),
});

// Type exports
export type UpdateProfileBody = z.infer<typeof updateProfileBody>;
