// Middleware
export { validate } from "./validate.middleware";

// Common schemas
export {
  emptyObjectSchema,
  mongoIdSchema,
  idParamSchema,
  deckIdParamSchema,
  paginationSchema,
  optionalPaginationSchema,
} from "./common.schema";

// Common types
export type {
  EmptyObject,
  IdParam,
  DeckIdParam,
  PaginationQuery,
} from "./common.schema";

// Deck schemas
export {
  createDeckBody,
  updateDeckBody,
  generateAIDeckBody,
} from "./deck.schema";

// Deck types
export type {
  CreateDeckBody,
  UpdateDeckBody,
  GenerateAIDeckBody,
} from "./deck.schema";

// Card schemas
export {
  createCardBody,
  updateCardBody,
  cardsByDeckParams,
  askAiAboutCardBody,
} from "./card.schema";

// Card types
export type {
  CreateCardBody,
  UpdateCardBody,
  CardsByDeckParams,
  AskAiAboutCardBody,
} from "./card.schema";

// User schemas
export { updateProfileBody } from "./user.schema";

// User types
export type { UpdateProfileBody } from "./user.schema";

// Study session schemas
export {
  userGradeSchema,
  reviewedCardSchema,
  syncSessionBody,
  studyDeckParams,
  sessionIdParams,
  sessionHistoryQuery,
} from "./studySession.schema";

// Study session types
export type {
  UserGrade,
  ReviewedCard,
  SyncSessionBody,
  StudyDeckParams,
  SessionIdParams,
  SessionHistoryQuery,
} from "./studySession.schema";
