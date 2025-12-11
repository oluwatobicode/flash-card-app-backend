import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../config";
import { userProfileService } from "../services";

/**
 * Get current user's profile
 * Returns Better Auth user data + app-specific UserProfile data
 */
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userProfile = await userProfileService.getOrCreateProfile(userId);

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data: {
        user: req.user,
        profile: userProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update current user's profile
 * Only updates app-specific fields (studyStreak, etc.)
 */
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { studyStreak, averageMastery, lastStudyDate } = req.body;

    const userProfile = await userProfileService.updateProfile(userId, {
      studyStreak,
      averageMastery,
      lastStudyDate,
    });

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data: {
        profile: userProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};
