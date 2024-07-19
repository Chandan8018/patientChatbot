import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";
import User from "./models/user.model.js";

// Many-to-Many association with User model through a join table 'ConversationParticipants'
Conversation.belongsToMany(User, {
  through: "ConversationParticipants",
  as: "participants",
  foreignKey: "ConversationId",
});

Conversation.hasMany(Message, { as: "messages" });

// Many-to-Many association with Conversation model through a join table 'ConversationParticipants'
User.belongsToMany(Conversation, {
  through: "ConversationParticipants",
  as: "conversations",
  foreignKey: "UserId",
});

User.hasMany(Message, { as: "sentMessages", foreignKey: "senderId" });
User.hasMany(Message, { as: "receivedMessages", foreignKey: "receiverId" });

Conversation.hasMany(Message, { as: "messages", foreignKey: "conversationId" });
Message.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
});

Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });
Message.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
});

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

Conversation.hasMany(Message, { as: "messages", foreignKey: "conversationId" });
Message.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
});
