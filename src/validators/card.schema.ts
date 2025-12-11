import { z } from "zod";
import { mongoIdSchema } from "./common.schema";

/**
 * Create card request body
 */
export const createCardBody = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .max(1000, "Question must be 1000 characters or less"),
  answer: z
    .string()
    .min(1, "Answer is required")
    .max(2000, "Answer must be 2000 characters or less"),
  deckId: mongoIdSchema,
});

/**
 * Update card request body
 */
export const updateCardBody = z.object({
  question: z
    .string()
    .min(1, "Question cannot be empty")
    .max(1000, "Question must be 1000 characters or less")
    .optional(),
  answer: z
    .string()
    .min(1, "Answer cannot be empty")
    .max(2000, "Answer must be 2000 characters or less")
    .optional(),
});

/**
 * Card params with deckId for getting cards by deck
 */
export const cardsByDeckParams = z.object({
  deckId: mongoIdSchema,
});

// Type exports
export type CreateCardBody = z.infer<typeof createCardBody>;
export type UpdateCardBody = z.infer<typeof updateCardBody>;
export type CardsByDeckParams = z.infer<typeof cardsByDeckParams>;
