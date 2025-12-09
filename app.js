const express = require("express");
const morgan = require("morgan");
const app = express();

// this is to parse json data coming from client
app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV === "development") {
  morgan("dev");
}

module.exports = app;
