import { Request, Response } from "express";
import { HTTP_STATUS } from "../config";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: "error",
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
};
