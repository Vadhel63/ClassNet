const express = require("express");
const upload = require("../middleware/file-upload"); // Multer middleware for file upload
const assignmentController = require("../Controllers/AssignmentController");
const submissionController = require("../Controllers/SubmissionController");
const router = express.Router();
const auth = require("../middleware/auth");

// Assignment Routes
router.post(
  "/",
  upload.single("file"),
  auth,
  assignmentController.createAssignment
);

router.get("/class/:classId", assignmentController.getAssignmentsByClass); // Get assignments by class
router.put(
  "/:id",
  upload.single("file"),
  assignmentController.updateAssignment
);
router.delete("/:id", assignmentController.deleteAssignment);
module.exports = router;
