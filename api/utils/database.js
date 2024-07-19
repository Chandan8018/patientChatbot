import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_CONNECTION_URL, {
  dialect: "postgres",
  logging: false, // Set to console.log to debug SQL queries
});

export default sequelize;
