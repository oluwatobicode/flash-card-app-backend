import { Request, Response, NextFunction } from "express";

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { question, answer, deckId } = req.body;

  try {
    if (!question || !answer || !deckId) {
      res.status(400).json({
        status: "fail",
        message: "question, answer and deckId are required fields",
      });
    }

    const newCard = await Card.create({
      question,
      answer,
      deckId,
    });

    res.status(201).json({
      status: "success",
      message: "Card created successfully",
      data: {
        newCard,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }
};

export const askAiAboutCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement ASK AI ABOUT THAT A SPECIFIC CARD LOGIC
    res.status(200).json({
      status: "success",
      message: "Ask AI about card endpoint - to be implemented",
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
