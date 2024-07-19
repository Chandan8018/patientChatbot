import { DataTypes } from "sequelize";
import sequelize from "../utils/database.js";
import User from "./user.model.js";
import Conversation from "./conversation.model.js";

const Message = sequelize.define(
  "Message",
  {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define associations
Message.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
});
Conversation.hasMany(Message, {
  as: "messages",
  foreignKey: "conversationId",
});

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

export default Message;
