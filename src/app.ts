import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { config, connectDB } from "./config";
import {
  authRoutes,
  userRoutes,
  deckRoutes,
  cardRoutes,
  studySessionRoutes,
} from "./routes";
import { errorHandler, notFoundHandler } from "./middleware";

const app: Application = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/decks", deckRoutes);
app.use("/api/v1/cards", cardRoutes);
app.use("/api/v1/study", studySessionRoutes);

// Handle undefined routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
});

export default app;
