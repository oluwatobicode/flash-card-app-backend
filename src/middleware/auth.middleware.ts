import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth, Session } from "../lib";

// Extend Express Request to include user and session
declare module "express-serve-static-core" {
  interface Request {
    user?: Session["user"];
    session?: Session["session"];
  }
}

/**
 * Middleware to require authentication for protected routes
 * Extracts user and session from Better Auth and attaches to request
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized - Please sign in to access this resource",
      });
      return;
    }

    // Attach user and session to request for use in route handlers
    req.user = session.user;
    req.session = session.session;

    next();
  } catch {
    res.status(401).json({
      status: "error",
      message: "Authentication failed",
    });
  }
};

/**
 * Optional auth middleware - doesn't require auth but attaches user if present
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.user = session.user;
      req.session = session.session;
    }

    next();
  } catch {
    // Continue without auth if session check fails
    next();
  }
};
