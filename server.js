const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;

const DB = process.env.DATABASE_URL_ONLINE.replace(
  "<db_password>",
  process.env.db_password
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
