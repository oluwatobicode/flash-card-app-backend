export { default as UserProfile } from "./userProfile.model";
export { default as Deck } from "./deck.model";
export { default as Card } from "./card.model";
export { default as StudySession } from "./studySession.model";

// Re-export interfaces from dedicated interfaces directory
export type {
  IUserProfile,
  IDeck,
  ICard,
  IStudySession,
  IReviewedCard,
} from "../interfaces";
