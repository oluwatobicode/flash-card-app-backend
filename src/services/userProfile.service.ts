import { UserProfile } from "../models";
import { IUserProfile } from "../interfaces";

interface UpdateProfileData {
  studyStreak?: number;
  averageMastery?: number;
  lastStudyDate?: Date;
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
