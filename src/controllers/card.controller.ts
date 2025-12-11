import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../config";
import { cardService } from "../services";

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

    const newCard = await cardService.createCard({
      question,
      answer,
      deckId,
    });

    res.status(HTTP_STATUS.CREATED).json({
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
    const { id } = req.params;

    console.log(id);

    const card = await cardService.deleteCard(id);

    console.log(card);

    if (!card) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: "error",
        message: "Card not found",
      });
    }

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
    console.log("Error deleting card:", err);
  }
};

export const updateCardById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedCard = await cardService.updateCard(id, req.body);

    if (!updatedCard) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: "error",
        message: "Card not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      message: "Card updated successfully",
      data: { updatedCard },
    });
  } catch (err) {
    next(err);
  }
};
