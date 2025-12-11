import dotenv from "dotenv";

dotenv.config();

/**
 * Application Configuration
 *
 * Required environment variables:
 * - PORT: Server port (default: 3000)
 * - NODE_ENV: Environment (development/production)
 * - DATABASE_URL_ONLINE or LOCAL_MONGO_URL: MongoDB connection string
 * - DB_PASSWORD: Database password (for DATABASE_URL_ONLINE)
 *
 * Better Auth Configuration:
 * - BETTER_AUTH_SECRET: Secret key for session encryption (min 32 chars)
 * - BETTER_AUTH_URL: Base URL for auth callbacks (e.g., http://localhost:3000)
 *
 * Google OAuth Configuration:
 * - GOOGLE_CLIENT_ID: From Google Cloud Console
 * - GOOGLE_CLIENT_SECRET: From Google Cloud Console
 */
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl:
    process.env.DATABASE_URL_ONLINE?.replace(
      "<db_password>",
      process.env.DB_PASSWORD || "",
    ) ||
    process.env.LOCAL_MONGO_URL ||
    "mongodb://localhost:27017/flashcard-app",
  // Better Auth config
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // Gemini AI
  geminiApiKey: process.env.GEMINI_API_KEY,
};
