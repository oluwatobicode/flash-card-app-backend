import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../config";
import {
  cardService,
  deckService,
  studySessionService,
  aiService,
} from "../services";
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  calculateNextReview,
} from "../utils";
import { ICard } from "../interfaces";

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
    const userId = req.user!.id;
    const { deckId, startTime, endTime, reviewedCards } = req.body;

    // Verify deck exists and user owns it
    const deck = await deckService.getDeckById(deckId);
    if (!deck) {
      throw new NotFoundException("Deck not found");
    }
    if (String(deck.userId) !== String(userId)) {
      throw new ForbiddenException(
        "You do not have permission to sync sessions for this deck",
      );
    }

    // Process each reviewed card and update SRS data
    for (const reviewedCard of reviewedCards) {
      const card = await cardService.getCardById(reviewedCard.cardId);

      if (!card) {
        throw new NotFoundException(
          `Card with ID ${reviewedCard.cardId} not found`,
        );
      }

      // Verify card belongs to the deck
      if (String(card.deckId) !== String(deckId)) {
        throw new BadRequestException(
          `Card ${reviewedCard.cardId} does not belong to deck ${deckId}`,
        );
      }

      // Calculate new SRS values
      const srsResult = calculateNextReview(
        card.easeFactor,
        card.interval,
        card.repetition,
        reviewedCard.userGrade,
      );

      // Update card with new SRS data
      await cardService.updateCard(reviewedCard.cardId, {
        easeFactor: srsResult.easeFactor,
        interval: srsResult.interval,
        repetition: srsResult.repetition,
        nextReviewDate: srsResult.nextReviewDate,
      });
    }

    // Create study session with all reviewed cards
    const session = await studySessionService.syncSession({
      userId,
      deckId,
      startTime,
      endTime,
      reviewedCards,
    });

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      message: "Study session synced successfully",
      data: {
        sessionId: String(session._id),
        cardsReviewed: reviewedCards.length,
        session,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get session history with pagination
export const getSessionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const result = await studySessionService.getSessionsByUserId(userId, {
      limit,
      page,
    });

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data: {
        sessions: result.sessions,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get AI-analyzed session report
export const getSessionReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id: sessionId } = req.params;

    // Fetch session with card details
    const session = await studySessionService.getSessionWithCards(
      sessionId,
      userId,
    );

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    // Calculate session statistics
    const totalCards = session.reviewedCards.length;
    let againCount = 0;
    let hardCount = 0;
    let goodCount = 0;
    let easyCount = 0;
    let totalTimeSpent = 0;

    const struggledTopics: string[] = [];

    session.reviewedCards.forEach((review) => {
      // Count grades
      switch (review.userGrade) {
        case "again":
          againCount++;
          break;
        case "hard":
          hardCount++;
          break;
        case "good":
          goodCount++;
          break;
        case "easy":
          easyCount++;
          break;
      }

      // Track time
      if (review.timeSpent) {
        totalTimeSpent += review.timeSpent;
      }

      // Collect struggled topics (cards marked as "again" or "hard")
      if (
        (review.userGrade === "again" || review.userGrade === "hard") &&
        review.cardId
      ) {
        const card = review.cardId as unknown as ICard;
        if (card && card.question) {
          struggledTopics.push(card.question);
        }
      }
    });

    const averageTimePerCard = totalCards > 0 ? totalTimeSpent / totalCards : 0;

    // Generate AI analysis
    const aiAnalysis = await aiService.analyzeStudySession({
      totalCards,
      againCount,
      hardCount,
      goodCount,
      easyCount,
      averageTimePerCard,
      struggledTopics,
    });

    res.status(HTTP_STATUS.OK).json({
      status: "success",
      data: {
        session: {
          id: session._id,
          deckId: session.deckId,
          startTime: session.startTime,
          endTime: session.endTime,
          totalCards,
        },
        statistics: {
          totalCards,
          gradeDistribution: {
            again: againCount,
            hard: hardCount,
            good: goodCount,
            easy: easyCount,
          },
          averageTimePerCard: Math.round(averageTimePerCard),
          totalTimeSpent,
        },
        aiAnalysis,
        struggledTopics,
      },
    });
  } catch (err) {
    next(err);
  }
};
