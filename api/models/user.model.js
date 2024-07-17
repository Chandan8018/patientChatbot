import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js"; // Import your sequelize instance

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:
        "https://pics.craiyon.com/2023-07-15/dc2ec5a571974417a5551420a4fb0587.webp ",
    },
  },
  {
    timestamps: true,
  }
);

export default User;
