import { z } from "zod";
import { mongoIdSchema } from "./common.schema";

/**
 * User grade for card review
 */
export const userGradeSchema = z.enum(["easy", "good", "hard", "again"]);

/**
 * Single reviewed card in a session
 */
export const reviewedCardSchema = z.object({
  cardId: mongoIdSchema,
  userGrade: userGradeSchema,
  timeSpent: z.number().int().min(0).optional(),
  timeStamp: z.coerce.date(),
});

/**
 * Sync study session request body
 */
export const syncSessionBody = z.object({
  deckId: mongoIdSchema,
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  reviewedCards: z
    .array(reviewedCardSchema)
    .min(1, "At least one card review is required"),
});

/**
 * Study session params (deckId for starting study)
 */
export const studyDeckParams = z.object({
  deckId: mongoIdSchema,
});

/**
 * Session ID params
 */
export const sessionIdParams = z.object({
  id: mongoIdSchema,
});

// Type exports
export type UserGrade = z.infer<typeof userGradeSchema>;
export type ReviewedCard = z.infer<typeof reviewedCardSchema>;
export type SyncSessionBody = z.infer<typeof syncSessionBody>;
export type StudyDeckParams = z.infer<typeof studyDeckParams>;
export type SessionIdParams = z.infer<typeof sessionIdParams>;
