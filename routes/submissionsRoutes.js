const express = require("express");
const {
  createSubmission,
  getSubmissionsByAssignment,

  updateSubmission,
  deleteSubmission,
  gradeSubmission,
} = require("../Controllers/SubmissionController");
const auth = require("../middleware/auth");
const upload = require("../middleware/file-upload"); // Assuming you have a middleware for file upload
const router = express.Router();
const Submission = require("../models/Submissions");
// Student Routes
router.post("/:assignmentId", auth, upload.single("file"), createSubmission); // Student submits an assignment
router.put("/:id", upload.single("file"), updateSubmission); // Student updates an assignment
router.delete("/:id", deleteSubmission); // Student deletes an assignment

// Teacher Routes
router.get("/:assignmentId/submissions", getSubmissionsByAssignment);
router.get("/user/:assignmentId", auth, async (req, res) => {
  const { assignmentId } = req.params;
  try {
    // Find submissions based on assignment ID and user ID
    const submission = await Submission.find({
      assignmentId: assignmentId,
      studentId: req.userData.userId,
    });

    if (!submission) {
      return res.status(404).json({
        message: "No submission found for this user and assignment.",
      });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Teacher gets submissions for an assignment
router.put("/grade/:id", gradeSubmission); // Teacher grades a submission

module.exports = router;
