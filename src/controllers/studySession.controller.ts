import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../config";
import { cardService, deckService, studySessionService } from "../services";
import { NotFoundException, ForbiddenException } from "../utils";

// this would get all cards that is due for a session tody
export const study = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // console.log(req.params);
    const { deckId } = req.params;

    if (!deckId) {
      throw new NotFoundException("Invalid deck id");
    }

    const userId = req.user!.id;

    // Check deck exists and ownership
    const deck = await deckService.getDeckById(deckId);
    if (!deck) {
      throw new NotFoundException("Deck not found");
    }
    if (String(deck.userId) !== String(userId)) {
      throw new ForbiddenException(
        "You do not have permission to study this deck",
      );
    }

    // Parse limit query param
    const requestedLimit = Number(req.query.limit) || 20;
    const limit = Math.min(Math.max(requestedLimit, 1), 100);

    // Fetch due cards using DB query
    const getDueCards = await cardService.getDueCardsByDeckId(deckId, limit);

    // create a study session
    const session = await studySessionService.createSession({
      userId,
      deckId,
    });

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      message: "Study session started",
      data: {
        sessionId: String(session._id),
        results: getDueCards.length,
        cards: getDueCards,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const syncStudySession = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Implement sync study session logic
    res.status(200).json({
      status: "success",
      message: "Sync study session endpoint - to be implemented",
    });
  } catch (err) {
    next(err);
  }
};
