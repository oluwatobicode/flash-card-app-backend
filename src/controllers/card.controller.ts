import { Request, Response, NextFunction } from "express";
import { Card } from "../models";

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement create card logic
    res.status(201).json({
      status: "success",
      message: "Create card endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement delete card logic
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCardById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement update card by ID logic
    res.status(200).json({
      status: "success",
      message: "Update card by ID endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};
