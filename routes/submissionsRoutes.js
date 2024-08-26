const express = require("express");
const router = express.Router();
const Submission = require("./../models/Submissions");

// Create a new submission
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newSubmission = new Submission(data);
    const response = await newSubmission.save();
    console.log("Submission data saved successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get submissions by assignment ID
router.get("/assignment/:assignmentId", async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const response = await Submission.find({
      assignmentId: assignmentId,
    }).populate("studentId");
    console.log("Submissions fetched successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get a single submission by ID
router.get("/:id", async (req, res) => {
  try {
    const submissionId = req.params.id;
    const response = await Submission.findById(submissionId)
      .populate("assignmentId")
      .populate("studentId");
    if (!response) {
      res.status(404).json({ message: "Submission not found" });
    } else {
      console.log("Submission fetched successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get all submissions
router.get("/", async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("assignmentId")
      .populate("studentId");
    console.log("Submissions fetched successfully");
    res.status(200).json(submissions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Update a submission by ID
router.put("/:id", async (req, res) => {
  try {
    const submissionId = req.params.id;
    const updatedSubmissionData = req.body;
    const response = await Submission.findByIdAndUpdate(
      submissionId,
      updatedSubmissionData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated document
      }
    );
    if (!response) {
      res.status(404).json({ message: "Submission not found" });
    } else {
      console.log("Submission data updated successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Delete a submission by ID
router.delete("/:id", async (req, res) => {
  try {
    const submissionId = req.params.id;
    const response = await Submission.findByIdAndDelete(submissionId);
    if (!response) {
      res.status(404).json({ message: "Submission not found" });
    } else {
      console.log("Submission data deleted successfully");
      res.status(200).json({ message: "Submission successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
