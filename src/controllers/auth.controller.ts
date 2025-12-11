import { Request, Response, NextFunction } from "express";
import { User } from "../models";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement login logic
    res.status(200).json({
      status: "success",
      message: "Login endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement logout logic
    res.status(200).json({
      status: "success",
      message: "Logout endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement protect middleware
    next();
  } catch (err) {
    next(err);
  }
};

export const loginWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement Google OAuth login
    res.status(200).json({
      status: "success",
      message: "Google login endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};

export const validateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement email validation
    res.status(200).json({
      status: "success",
      message: "Email validation endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};

export const sendToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement send token logic
    res.status(200).json({
      status: "success",
      message: "Send token endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement password update logic
    res.status(200).json({
      status: "success",
      message: "Update password endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};
