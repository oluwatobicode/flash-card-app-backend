import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as string,
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    throw new Error("Invalid or expired token");
  }
};
