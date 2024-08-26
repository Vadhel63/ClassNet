const mongoose = require("mongoose");

// SupportRequest Schema
const SupportRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requestDetails: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "in progress", "resolved", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the SupportRequest model
const SupportRequest = mongoose.model("SupportRequest", SupportRequestSchema);

module.exports = SupportRequest;
