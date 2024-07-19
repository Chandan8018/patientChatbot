import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { Op } from "sequelize";
import sequelize from "../utils/database.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    // Check if both users exist
    const sender = await User.findByPk(senderId);
    const receiver = await User.findByPk(receiverId);

    if (!sender || !receiver) {
      return res
        .status(400)
        .json({ error: "Sender or receiver does not exist" });
    }

    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        senderId,
        receiverId,
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      conversationId: conversation.id,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    // Fetch the conversation between sender and receiver
    const conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: senderId },
        ],
      },
      include: {
        model: Message,
        as: "messages",
      },
    });

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
