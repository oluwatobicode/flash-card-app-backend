import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-this",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  databaseUrl:
    process.env.DATABASE_URL_ONLINE?.replace(
      "<db_password>",
      process.env.DB_PASSWORD || "",
    ) ||
    process.env.LOCAL_MONGO_URL ||
    "mongodb://localhost:27017/flashcard-app",
};
