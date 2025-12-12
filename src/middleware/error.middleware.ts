import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS, ERROR_MESSAGES } from "../config";
import { AppException } from "../utils/exceptions";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  // Handle custom AppException
  if (err instanceof AppException) {
    if (process.env.NODE_ENV === "development") {
      res.status(err.statusCode).json({
        status: "error",
        message: err.message,
        stack: err.stack,
      });
    } else {
      res.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: "error",
      message: "Invalid ID format",
    });
    return;
  }

  // Handle Mongoose duplicate key errors
  if (
    err.name === "MongoServerError" &&
    (err as Error & { code?: number }).code === 11000
  ) {
    res.status(HTTP_STATUS.CONFLICT).json({
      status: "error",
      message: ERROR_MESSAGES.DUPLICATE_ENTRY,
    });
    return;
  }

  // Log unexpected errors
  if (process.env.NODE_ENV === "development") {
    console.error("Unhandled error:", err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
