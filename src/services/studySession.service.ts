import mongoose from "mongoose";
import { StudySession } from "../models";
import { IStudySession, IReviewedCard } from "../interfaces";

interface CreateSessionData {
  userId: string;
  deckId: string;
}

interface SyncSessionData {
  userId: string;
  deckId: string;
  startTime: Date;
  endTime: Date;
  reviewedCards: Array<{
    cardId: string;
    userGrade: "easy" | "good" | "hard" | "again";
    timeSpent?: number;
    timeStamp: Date;
  }>;
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
 * Get all sessions for a user with pagination
 */
export const getSessionsByUserId = async (
  userId: string,
  options?: {
    limit?: number;
    page?: number;
  },
): Promise<{
  sessions: IStudySession[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const limit = options?.limit || 10;
  const page = options?.page || 1;
  const skip = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    StudySession.find({ userId })
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(limit),
    StudySession.countDocuments({ userId }),
  ]);

  return {
    sessions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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

/**
 * Sync a completed study session
 */
export const syncSession = async (
  data: SyncSessionData,
): Promise<IStudySession> => {
  return StudySession.create({
    userId: data.userId,
    deckId: new mongoose.Types.ObjectId(data.deckId),
    startTime: data.startTime,
    endTime: data.endTime,
    reviewedCards: data.reviewedCards.map((card) => ({
      cardId: new mongoose.Types.ObjectId(card.cardId),
      userGrade: card.userGrade,
      timeSpent: card.timeSpent,
      timeStamp: card.timeStamp,
    })),
  });
};

/**
 * Get session by ID with card details populated
 */
export const getSessionWithCards = async (
  sessionId: string,
  userId: string,
): Promise<IStudySession | null> => {
  const session = await StudySession.findById(sessionId).populate(
    "reviewedCards.cardId",
  );

  if (!session) {
    return null;
  }

  // Verify ownership
  if (String(session.userId) !== String(userId)) {
    return null;
  }

  return session;
};
