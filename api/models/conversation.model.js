import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";

const Conversation = sequelize.define(
  "Conversation",
  {
    // Define attributes here if needed
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Conversation;
