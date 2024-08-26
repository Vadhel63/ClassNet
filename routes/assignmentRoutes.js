const express = require("express");
const router = express.Router();
const Assignment = require("./../models/Assignment");

// Create a new assignment
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newAssignment = new Assignment(data);
    const response = await newAssignment.save();
    console.log("Assignment data saved successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get assignments by class ID
router.get("/class/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;
    const response = await Assignment.find({ classId: classId });
    console.log("Assignments fetched successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get a single assignment by ID
router.get("/:id", async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const response = await Assignment.findById(assignmentId)
      .populate("classId")
      .populate("submissions");
    if (!response) {
      res.status(404).json({ message: "Assignment not found" });
    } else {
      console.log("Assignment fetched successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("classId")
      .populate("submissions");
    console.log("Assignments fetched successfully");
    res.status(200).json(assignments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Update an assignment by ID
router.put("/:id", async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const updatedAssignmentData = req.body;
    const response = await Assignment.findByIdAndUpdate(
      assignmentId,
      updatedAssignmentData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated document
      }
    );
    if (!response) {
      res.status(404).json({ message: "Assignment not found" });
    } else {
      console.log("Assignment data updated successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Delete an assignment by ID
router.delete("/:id", async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const response = await Assignment.findByIdAndDelete(assignmentId);
    if (!response) {
      res.status(404).json({ message: "Assignment not found" });
    } else {
      console.log("Assignment data deleted successfully");
      res.status(200).json({ message: "Assignment successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
