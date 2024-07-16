import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  "postgresql://chandan:Chandan@143@localhost:5432/chatbotDB"
);

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully with postgres.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
