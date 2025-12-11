import { Request, Response, NextFunction } from "express";
import { Deck } from "../models";

export const createDeck = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement create deck logic
    res.status(201).json({
      status: "success",
      message: "Create deck endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDeck = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement delete deck logic
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllDecks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement get all decks logic
    res.status(200).json({
      status: "success",
      message: "Get all decks endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};

export const getDeckById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement get deck by ID logic
    res.status(200).json({
      status: "success",
      message: "Get deck by ID endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};

export const updateDeckById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement update deck by ID logic
    res.status(200).json({
      status: "success",
      message: "Update deck by ID endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};
