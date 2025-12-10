const express = require("express");
const morgan = require("morgan");
const app = express();

// routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");
const deckRoutes = require("./routes/deckRoutes");
const cardRoutes = require("./routes/cardRoutes");

// this is to parse json data coming from client
app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV === "development") {
  morgan("dev");
}

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/decks", deckRoutes);
app.use("/api/v1/cards", cardRoutes);
app.use("/api/v1/study", studySessionRoutes);

module.exports = app;
