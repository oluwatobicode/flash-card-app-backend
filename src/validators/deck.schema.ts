import { z } from "zod";

/**
 * Create deck request body
 */
export const createDeckBody = z.object({
  deckName: z
    .string()
    .min(1, "Deck name is required")
    .max(100, "Deck name must be 100 characters or less"),
});

/**
 * Update deck request body
 */
export const updateDeckBody = z.object({
  deckName: z
    .string()
    .min(1, "Deck name cannot be empty")
    .max(100, "Deck name must be 100 characters or less")
    .optional(),
});

/**
 * Generate AI deck request body (used with file upload)
 */
export const generateAIDeckBody = z.object({
  deckName: z
    .string()
    .min(1, "Deck name is required")
    .max(100, "Deck name must be 100 characters or less"),
});

// Type exports
export type CreateDeckBody = z.infer<typeof createDeckBody>;
export type UpdateDeckBody = z.infer<typeof updateDeckBody>;
export type GenerateAIDeckBody = z.infer<typeof generateAIDeckBody>;
