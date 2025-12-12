import { studySessionController } from "../src/controllers";
import { HTTP_STATUS } from "../src/config";

// Mock services
jest.mock("../src/services", () => ({
  deckService: {
    getDeckById: jest.fn(),
  },
  cardService: {
    getDueCardsByDeckId: jest.fn(),
  },
  studySessionService: {
    createSession: jest.fn(),
  },
}));

import { deckService, cardService, studySessionService } from "../src/services";

describe("studySessionController.study", () => {
  const user = { id: "user-1" } as any;

  const mockReq = (params: any = {}, query: any = {}, userObj: any = user) =>
    ({
      params,
      query,
      user: userObj,
    }) as any;

  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 404 when deck not found", async () => {
    (deckService.getDeckById as jest.Mock).mockResolvedValue(null);

    const req = mockReq({ deckId: "deck-1" });
    const res = mockRes();

    await studySessionController.study(req, res, next);

    expect(deckService.getDeckById).toHaveBeenCalledWith("deck-1");
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
  });

  it("returns 403 when user doesn't own deck", async () => {
    (deckService.getDeckById as jest.Mock).mockResolvedValue({
      userId: "other-user",
    });

    const req = mockReq({ deckId: "deck-1" });
    const res = mockRes();

    await studySessionController.study(req, res, next);

    expect(deckService.getDeckById).toHaveBeenCalledWith("deck-1");
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it("creates a session and returns due cards", async () => {
    const deck = { _id: "deck-1", userId: "user-1" };
    (deckService.getDeckById as jest.Mock).mockResolvedValue(deck);
    const cards = [
      { _id: "c1", question: "q1", answer: "a1" },
      { _id: "c2", question: "q2", answer: "a2" },
    ];
    (cardService.getDueCardsByDeckId as jest.Mock).mockResolvedValue(cards);
    (studySessionService.createSession as jest.Mock).mockResolvedValue({
      _id: "session-1",
    });

    const req = mockReq({ deckId: "deck-1" }, { limit: "10" });
    const res = mockRes();

    await studySessionController.study(req, res, next);

    expect(studySessionService.createSession).toHaveBeenCalledWith({
      userId: "user-1",
      deckId: "deck-1",
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        message: "Study session started",
        data: expect.objectContaining({
          sessionId: "session-1",
          results: 2,
          cards,
        }),
      }),
    );
  });

  it("creates a session even when no cards are due", async () => {
    const deck = { _id: "deck-2", userId: "user-1" };
    (deckService.getDeckById as jest.Mock).mockResolvedValue(deck);
    (cardService.getDueCardsByDeckId as jest.Mock).mockResolvedValue([]);
    (studySessionService.createSession as jest.Mock).mockResolvedValue({
      _id: "session-2",
    });

    const req = mockReq({ deckId: "deck-2" });
    const res = mockRes();

    await studySessionController.study(req, res, next);

    expect(studySessionService.createSession).toHaveBeenCalledWith({
      userId: "user-1",
      deckId: "deck-2",
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        message: "Study session started",
        data: expect.objectContaining({
          sessionId: "session-2",
          results: 0,
          cards: [],
        }),
      }),
    );
  });
});

export {};
