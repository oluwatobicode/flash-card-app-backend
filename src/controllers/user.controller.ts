import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { HTTP_STATUS } from "../config";
import { userProfileService } from "../services";
import { auth, uploadProfilePicture } from "../lib";

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
 * Updates both Better Auth user data (name, email) and app-specific fields
 */
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { studyStreak, averageMastery, lastStudyDate, name, email } =
      req.body;
    const file = req.file as Express.Multer.File | undefined;

    // Update Better Auth user data (name)
    if (name) {
      await auth.api.updateUser({
        body: { name },
        headers: fromNodeHeaders(req.headers),
      });
    }

    // Update Better Auth user email (requires verification)
    if (email) {
      await auth.api.changeEmail({
        body: { newEmail: email },
        headers: fromNodeHeaders(req.headers),
      });
    }

    // Handle profile picture upload
    let profilePictureUrl: string | undefined;
    if (file) {
      const uploadResult = await uploadProfilePicture(file.buffer, userId);
      profilePictureUrl = uploadResult.secure_url;
    }

    // Update UserProfile with app-specific fields
    const userProfile = await userProfileService.updateProfile(userId, {
      studyStreak,
      averageMastery,
      lastStudyDate,
      profilePictureUrl,
    });

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      message: email
        ? "Profile updated. Please check your email to verify the new email address."
        : "Profile updated successfully",
      data: {
        profile: userProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get dashboard statistics for current user
 * Returns aggregated learning data across all decks and sessions
 */
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const stats = await userProfileService.getDashboardStats(userId);

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};
