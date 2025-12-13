import { UserProfile, Deck, Card, StudySession } from "../models";
import { IUserProfile } from "../interfaces";

interface UpdateProfileData {
  studyStreak?: number;
  averageMastery?: number;
  lastStudyDate?: Date;
  profilePictureUrl?: string;
}

/**
 * Get user profile by userId, creates one if it doesn't exist
 */
export const getOrCreateProfile = async (
  userId: string,
): Promise<IUserProfile> => {
  let userProfile = await UserProfile.findOne({ userId });

  if (!userProfile) {
    userProfile = await UserProfile.create({ userId });
  }

  return userProfile;
};

/**
 * Update user profile fields
 */
export const updateProfile = async (
  userId: string,
  data: UpdateProfileData,
): Promise<IUserProfile | null> => {
  const updateData: Partial<UpdateProfileData> = {};

  if (data.studyStreak !== undefined) updateData.studyStreak = data.studyStreak;
  if (data.averageMastery !== undefined)
    updateData.averageMastery = data.averageMastery;
  if (data.lastStudyDate !== undefined)
    updateData.lastStudyDate = data.lastStudyDate;
  if (data.profilePictureUrl !== undefined)
    updateData.profilePictureUrl = data.profilePictureUrl;

  return UserProfile.findOneAndUpdate({ userId }, updateData, {
    new: true,
    upsert: true,
  });
};

/**
 * Increment total deck count for user
 */
export const incrementDeckCount = async (userId: string): Promise<void> => {
  await UserProfile.findOneAndUpdate(
    { userId },
    { $inc: { totalDeck: 1 } },
    { upsert: true },
  );
};

/**
 * Decrement total deck count for user
 */
export const decrementDeckCount = async (userId: string): Promise<void> => {
  await UserProfile.findOneAndUpdate(
    { userId },
    { $inc: { totalDeck: -1 } },
    { upsert: true },
  );
};

/**
 * Get aggregated dashboard statistics for a user
 */
export const getDashboardStats = async (userId: string) => {
  // Get user profile
  const userProfile = await getOrCreateProfile(userId);

  // Get all user's decks
  const userDecks = await Deck.find({ userId });
  const deckIds = userDecks.map((deck) => deck._id);

  // Total decks count
  const totalDecks = userDecks.length;

  // Total cards count across all decks
  const totalCards = await Card.countDocuments({
    deckId: { $in: deckIds },
  });

  // Cards due for review (where nextReviewDate <= now or doesn't exist)
  const now = new Date();
  const cardsDue = await Card.countDocuments({
    deckId: { $in: deckIds },
    $or: [
      { nextReviewDate: { $lte: now } },
      { nextReviewDate: { $exists: false } },
      { nextReviewDate: null },
    ],
  });

  // Total study sessions
  const totalSessions = await StudySession.countDocuments({ userId });

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSessionsCount = await StudySession.countDocuments({
    userId,
    startTime: { $gte: sevenDaysAgo },
  });

  // Total cards reviewed (sum of all reviewedCards arrays across all sessions)
  const sessionsWithCards = await StudySession.aggregate([
    { $match: { userId } },
    {
      $project: {
        cardsReviewed: { $size: "$reviewedCards" },
      },
    },
    {
      $group: {
        _id: null,
        totalCardsReviewed: { $sum: "$cardsReviewed" },
      },
    },
  ]);

  const totalCardsReviewed =
    sessionsWithCards.length > 0 ? sessionsWithCards[0].totalCardsReviewed : 0;

  // Average mastery - calculate from cards' ease factors and intervals
  // Higher ease factor and interval indicate better mastery
  const cardMasteryStats = await Card.aggregate([
    { $match: { deckId: { $in: deckIds } } },
    {
      $group: {
        _id: null,
        avgEaseFactor: { $avg: "$easeFactor" },
        avgRepetition: { $avg: "$repetition" },
      },
    },
  ]);

  // Calculate average mastery as a percentage (0-100)
  // Based on ease factor (2.5 is default, higher is better) and repetition count
  let averageMastery = 0;
  if (cardMasteryStats.length > 0 && totalCards > 0) {
    const { avgEaseFactor, avgRepetition } = cardMasteryStats[0];
    // Normalize: easeFactor from 1.3-4.0 -> 0-50%, repetition 0-10+ -> 0-50%
    const easeScore = Math.min(((avgEaseFactor - 1.3) / (4.0 - 1.3)) * 50, 50);
    const repScore = Math.min((avgRepetition / 10) * 50, 50);
    averageMastery = Math.round(easeScore + repScore);
  }

  return {
    totalDecks,
    totalCards,
    cardsDue,
    totalSessions,
    recentActivity: recentSessionsCount,
    totalCardsReviewed,
    studyStreak: userProfile.studyStreak,
    averageMastery,
    lastStudyDate: userProfile.lastStudyDate,
  };
};
