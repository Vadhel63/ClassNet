const mongoose = require("mongoose");

// Assignment Schema
const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  ],
  fileUrl: {
    type: String, // URL or path to the uploaded assignment file
  },
  links: [
    {
      type: String, // Optional links for assignment references
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User who created the assignment
    ref: "User", // Ensure you have a User model
    required: true,
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

// Export the Assignment model
const Assignment = mongoose.model("Assignment", AssignmentSchema);

module.exports = Assignment;
