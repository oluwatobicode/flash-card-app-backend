import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../config";
import {
  deckService,
  cardService,
  aiService,
  userProfileService,
} from "../services";

/**
 * Create a new empty deck
 */
export const createDeck = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { deckName } = req.body;

    const deck = await deckService.createDeck({ deckName, userId });
    await userProfileService.incrementDeckCount(userId);

    res.status(HTTP_STATUS.CREATED).json({
      status: "success",
      data: { deck },
    });
  } catch (err) {
    console.log("Error creating deck:", err);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
    next(err);
  }
};

/**
 * Delete a deck and all its cards
 */
export const deleteDeck = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const deck = await deckService.getDeckById(id);

    if (!deck) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: "error",
        message: "Deck not found",
      });
      return;
    }

    if (deck.userId !== userId) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        status: "error",
        message: "You do not have permission to delete this deck",
      });
      return;
    }

    // Delete all cards in the deck first
    const cards = await cardService.getCardsByDeckId(id);
    for (const card of cards) {
      await cardService.deleteCard(String(card._id));
    }

    await deckService.deleteDeck(id);
    await userProfileService.decrementDeckCount(userId);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
    console.log("Error deleting deck:", err);
  }
};

/**
 * Get all decks for the current user
 */
export const getAllDecks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const decks = await deckService.getDecksByUserId(userId);

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      results: decks.length,
      data: { decks },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single deck by ID
 */
export const getDeckById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const deck = await deckService.getDeckById(id);

    if (!deck) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: "error",
        message: "Deck not found",
      });
      return;
    }

    if (deck.userId !== userId) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        status: "error",
        message: "You do not have permission to view this deck",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data: { deck },
    });
  } catch (err) {
    next(err);
    console.log("Error getting deck by ID:", err);
  }
};

/**
 * Update a deck by ID
 */
export const updateDeckById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { deckName } = req.body;

    const deck = await deckService.getDeckById(id);

    if (!deck) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: "error",
        message: "Deck not found",
      });
      return;
    }

    if (deck.userId !== userId) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        status: "error",
        message: "You do not have permission to update this deck",
      });
      return;
    }

    const updatedDeck = await deckService.updateDeck(id, { deckName });

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data: { deck: updatedDeck },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate a deck with cards from an uploaded PDF
 */
export const generateAIDeck = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const file = req.file;
    const { deckName } = req.body;

    if (!file) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "No PDF file uploaded",
      });
      return;
    }

    if (!deckName) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Deck name is required",
      });
      return;
    }

    // Generate cards from PDF using AI
    const generatedCards = await aiService.generateCardsFromPdf(file.buffer);

    if (generatedCards.length === 0) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: "error",
        message: "Could not generate cards from the PDF content",
      });
      return;
    }

    // Create the deck
    const deck = await deckService.createDeck({ deckName, userId });
    await userProfileService.incrementDeckCount(userId);

    // Create all cards
    const deckId = String(deck._id);
    const createdCards = await Promise.all(
      generatedCards.map((card) =>
        cardService.createCard({
          question: card.question,
          answer: card.answer,
          deckId,
        }),
      ),
    );

    // Update deck card count
    await deckService.updateDeck(deckId, {});
    deck.totalCards = createdCards.length;

    res.status(HTTP_STATUS.CREATED).json({
      status: "success",
      message: `Generated ${createdCards.length} cards from PDF`,
      data: {
        deck,
        cards: createdCards,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
    next(err);
  }
};
