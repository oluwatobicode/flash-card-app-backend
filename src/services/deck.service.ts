import { Deck } from "../models";
import { IDeck } from "../interfaces";

interface CreateDeckData {
  deckName: string;
  userId: string;
}

interface UpdateDeckData {
  deckName?: string;
}

/**
 * Create a new deck
 */
export const createDeck = async (data: CreateDeckData): Promise<IDeck> => {
  return Deck.create(data);
};

/**
 * Get all decks for a user
 */
export const getDecksByUserId = async (userId: string): Promise<IDeck[]> => {
  return Deck.find({ userId });
};

/**
 * Get a deck by ID
 */
export const getDeckById = async (deckId: string): Promise<IDeck | null> => {
  return Deck.findById(deckId);
};

/**
 * Update a deck by ID
 */
export const updateDeck = async (
  deckId: string,
  data: UpdateDeckData,
): Promise<IDeck | null> => {
  return Deck.findByIdAndUpdate(deckId, data, { new: true });
};

/**
 * Delete a deck by ID
 */
export const deleteDeck = async (deckId: string): Promise<IDeck | null> => {
  return Deck.findByIdAndDelete(deckId);
};

/**
 * Increment total cards count for a deck
 */
export const incrementCardCount = async (deckId: string): Promise<void> => {
  await Deck.findByIdAndUpdate(deckId, { $inc: { totalCards: 1 } });
};

/**
 * Decrement total cards count for a deck
 */
export const decrementCardCount = async (deckId: string): Promise<void> => {
  await Deck.findByIdAndUpdate(deckId, { $inc: { totalCards: -1 } });
};
