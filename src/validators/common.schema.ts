import { z } from "zod";

/**
 * Empty object schema - enforces no extra properties
 * Use for requests that should have no body/params/query
 */
export const emptyObjectSchema = z.object({}).strict();

/**
 * MongoDB ObjectId format validation
 */
export const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID format");

/**
 * URL params with single ID
 */
export const idParamSchema = z.object({
  id: mongoIdSchema,
});

/**
 * URL params with deckId
 */
export const deckIdParamSchema = z.object({
  deckId: mongoIdSchema,
});

/**
 * Pagination query params with defaults
 */
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

/**
 * Optional pagination - allows empty query
 */
export const optionalPaginationSchema = paginationSchema.partial();

// Type exports
export type EmptyObject = z.infer<typeof emptyObjectSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type DeckIdParam = z.infer<typeof deckIdParamSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
