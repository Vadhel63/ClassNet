const express = require("express");
const router = express.Router();
const Message = require("./../models/Message");

// Create a new message
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newMessage = new Message(data);
    const response = await newMessage.save();
    console.log("Message sent successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get messages by recipient ID
router.get("/recipient/:recipientId", async (req, res) => {
  try {
    const recipientId = req.params.recipientId;
    const response = await Message.find({ recipientId: recipientId }).populate("senderId");
    console.log("Messages fetched successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get a single message by ID
router.get("/:id", async (req, res) => {
  try {
    const messageId = req.params.id;
    const response = await Message.findById(messageId).populate("senderId").populate("recipientId");
    if (!response) {
      res.status(404).json({ message: "Message not found" });
    } else {
      console.log("Message fetched successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().populate("senderId").populate("recipientId");
    console.log("Messages fetched successfully");
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Update a message by ID
router.put("/:id", async (req, res) => {
  try {
    const messageId = req.params.id;
    const updatedMessageData = req.body;
    const response = await Message.findByIdAndUpdate(
      messageId,
      updatedMessageData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated document
      }
    );
    if (!response) {
      res.status(404).json({ message: "Message not found" });
    } else {
      console.log("Message updated successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Delete a message by ID
router.delete("/:id", async (req, res) => {
  try {
    const messageId = req.params.id;
    const response = await Message.findByIdAndDelete(messageId);
    if (!response) {
      res.status(404).json({ message: "Message not found" });
    } else {
      console.log("Message deleted successfully");
      res.status(200).json({ message: "Message successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
