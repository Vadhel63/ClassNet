const mongoose = require("mongoose");

// Submission Schema
const SubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
  grade: {
    type: String,
  },
  feedback: {
    type: String,
  },
  submittedAt: {
    type: Date,
    required: true,
  },
  gradedAt: {
    type: Date,
  },
});

// Export the Submission model
const Submission = mongoose.model("Submission", SubmissionSchema);

module.exports = Submission;
