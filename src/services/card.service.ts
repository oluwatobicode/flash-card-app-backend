import mongoose from "mongoose";
import { Card } from "../models";
import { ICard } from "../interfaces";

interface CreateCardData {
  question: string;
  answer: string;
  deckId: string;
}

interface UpdateCardData {
  question?: string;
  answer?: string;
  easeFactor?: number;
  interval?: number;
  repetition?: number;
  nextReviewDate?: Date;
}

/**
 * Create a new card
 */
export const createCard = async (data: CreateCardData): Promise<ICard> => {
  return Card.create({
    ...data,
    deckId: new mongoose.Types.ObjectId(data.deckId),
  });
};

/**
 * Get all cards for a deck
 */
export const getCardsByDeckId = async (deckId: string): Promise<ICard[]> => {
  return Card.find({ deckId: new mongoose.Types.ObjectId(deckId) });
};

// this is for fetching all the due cards in a deck where nextReviewDate <=Date.now()
export const getDueCardsByDeckId = async (
  deckId: string,
  limit: number = 20,
): Promise<ICard[]> => {
  const now = new Date();
  return Card.find({
    deckId: new mongoose.Types.ObjectId(deckId),
    $or: [
      { nextReviewDate: { $lte: now } },
      { nextReviewDate: { $exists: false } },
      { nextReviewDate: null },
    ],
  })
    .sort({ nextReviewDate: 1 })
    .limit(limit);
};

/**
 * Get a card by ID
 */
export const getCardById = async (cardId: string): Promise<ICard | null> => {
  return Card.findById(cardId);
};

/**
 * Update a card by ID
 */
export const updateCard = async (
  cardId: string,
  data: UpdateCardData,
): Promise<ICard | null> => {
  return Card.findByIdAndUpdate(cardId, data, { new: true });
};

/**
 * Delete a card by ID
 */
export const deleteCard = async (cardId: string): Promise<ICard | null> => {
  return Card.findByIdAndDelete(cardId);
};

/**
 * Get cards due for review in a deck
 */
export const getDueCards = async (deckId: string): Promise<ICard[]> => {
  return Card.find({
    deckId: new mongoose.Types.ObjectId(deckId),
    nextReviewDate: { $lte: new Date() },
  });
};

/**
 * Update card after review (SRS fields)
 */
export const updateCardAfterReview = async (
  cardId: string,
  easeFactor: number,
  interval: number,
  repetition: number,
  nextReviewDate: Date,
): Promise<ICard | null> => {
  return Card.findByIdAndUpdate(
    cardId,
    { easeFactor, interval, repetition, nextReviewDate },
    { new: true },
  );
};
