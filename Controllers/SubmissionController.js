const Submission = require("../models/Submissions");

// Create a Submission (Student)
exports.createSubmission = async (req, res) => {
  console.log("hii");

  try {
    const { assignmentId } = req.params;
    const { comments } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const studentId = req.userData.userId;
    const submission = new Submission({
      assignmentId,
      studentId,
      fileUrl,
      comments,
    });

    await submission.save();
    res
      .status(201)
      .json({ message: "Submission created successfully", submission });
  } catch (error) {
    res.status(500).json({ message: "Error creating submission", error });
  }
};

// Get All Submissions by Assignment (Teacher)
exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    console.log(assignmentId);
    const submissions = await Submission.find({ assignmentId: assignmentId })
      .populate("studentId", "name email") // Populates student details
      .exec();

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error });
  }
};

// exports.getSubmissionsByAssignment1 = async (req, res) => {
//   try {
//     const StudentId = req.userData.userId;

//     const { assignmentId } = req.params;
//     const submissions = await Submission.find({
//       assignmentId: assignmentId,
//       studentId: StudentId,
//     });

//     res.status(200).json(submissions);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching submissions", error });
//   }
// };

// Update a Submission (Student)
exports.updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update the comments or file if a new one is uploaded
    if (req.file) {
      submission.fileUrl = `/uploads/${req.file.filename}`;
    }
    submission.comments = comments;

    await submission.save();
    res
      .status(200)
      .json({ message: "Submission updated successfully", submission });
  } catch (error) {
    res.status(500).json({ message: "Error updating submission", error });
  }
};

// Delete a Submission (Student)
exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const submission = await Submission.findByIdAndDelete(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting submission", error });
  }
};

// Update a Submission (Teacher: Grade and provide feedback)
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = Date.now();

    await submission.save();
    res
      .status(200)
      .json({ message: "Submission graded successfully", submission });
  } catch (error) {
    res.status(500).json({ message: "Error grading submission", error });
  }
};
