import mongoose from "mongoose";
import { StudySession } from "../models";
import { IStudySession, IReviewedCard } from "../interfaces";

interface CreateSessionData {
  userId: string;
  deckId: string;
}

/**
 * Create a new study session
 */
export const createSession = async (
  data: CreateSessionData,
): Promise<IStudySession> => {
  return StudySession.create({
    userId: data.userId,
    deckId: new mongoose.Types.ObjectId(data.deckId),
    startTime: new Date(),
    reviewedCards: [],
  });
};

/**
 * Get study session by ID
 */
export const getSessionById = async (
  sessionId: string,
): Promise<IStudySession | null> => {
  return StudySession.findById(sessionId);
};

/**
 * Get all sessions for a user
 */
export const getSessionsByUserId = async (
  userId: string,
): Promise<IStudySession[]> => {
  return StudySession.find({ userId }).sort({ startTime: -1 });
};

/**
 * Add a reviewed card to session
 */
export const addReviewedCard = async (
  sessionId: string,
  cardData: Omit<IReviewedCard, "timeStamp">,
): Promise<IStudySession | null> => {
  return StudySession.findByIdAndUpdate(
    sessionId,
    {
      $push: {
        reviewedCards: {
          ...cardData,
          timeStamp: new Date(),
        },
      },
    },
    { new: true },
  );
};

/**
 * End a study session
 */
export const endSession = async (
  sessionId: string,
): Promise<IStudySession | null> => {
  return StudySession.findByIdAndUpdate(
    sessionId,
    { endTime: new Date() },
    { new: true },
  );
};

/**
 * Get recent sessions for a user (for stats)
 */
export const getRecentSessions = async (
  userId: string,
  limit: number = 10,
): Promise<IStudySession[]> => {
  return StudySession.find({ userId }).sort({ startTime: -1 }).limit(limit);
};
