import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../config";
import { cardService, aiService } from "../services";
import { NotFoundException } from "../utils";

/**
 * Create a new card
 */
export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { question, answer, deckId } = req.body;

    const newCard = await cardService.createCard({
      question,
      answer,
      deckId,
    });

    res.status(HTTP_STATUS.CREATED).json({
      status: "success",
      message: "Card created successfully",
      data: { newCard },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Ask AI for explanation about a card
 */
export const askAiAboutCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { question, answer } = req.body;

    const explanation = await aiService.askAiAboutCard({
      question,
      answer,
    });

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      message: "AI explanation generated successfully",
      data: { explanation },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a card by ID
 */
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const card = await cardService.deleteCard(id);

    if (!card) {
      throw new NotFoundException("Card not found");
    }

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a card by ID
 */
export const updateCardById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedCard = await cardService.updateCard(id, req.body);

    if (!updatedCard) {
      throw new NotFoundException("Card not found");
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
