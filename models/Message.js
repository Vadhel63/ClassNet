const mongoose = require("mongoose");

// Message Schema
const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  readAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Message model
const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
