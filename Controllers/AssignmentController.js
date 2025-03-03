const Assignment = require("../models/Assignment");
const mongoose = require("mongoose");

// Create Assignment
const createAssignment = async (req, res) => {
  const { title, dueDate, instructions, classId } = req.body;
  const fileUrl = req.file ? req.file.path : null; // Assuming you use multer for file upload
  console.log(req.userData.userId);
  const newAssignment = new Assignment({
    title,
    dueDate,
    instructions,
    classId,
    fileUrl,
    createdBy: req.userData.userId, // Assuming req.user contains user information from authentication middleware
  });

  try {
    const savedAssignment = await newAssignment.save();
    res.status(201).json({ assignment: savedAssignment });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ message: "Error creating assignment.", error });
  }
};

// Get Assignments by Class
const getAssignmentsByClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const assignments = await Assignment.find({ classId })
      .populate("createdBy") // Populate the creator's details
      .sort({ dueDate: 1 }); // Sort by due date
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Error fetching assignments.", error });
  }
};

// Update Assignment
const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { title, dueDate, instructions } = req.body;

  try {
    // Find the existing assignment
    const existingAssignment = await Assignment.findById(id);

    if (!existingAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    // Update only provided fields
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      {
        title: title || existingAssignment.title, // If title is provided, use it; otherwise, keep the existing one
        dueDate: dueDate || existingAssignment.dueDate, // Same for dueDate
        instructions: instructions || existingAssignment.instructions, // Same for instructions
        fileUrl: req.file ? req.file.path : existingAssignment.fileUrl, // Only update fileUrl if a new file is provided
        updatedAt: Date.now(), // Update timestamp
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({ assignment: updatedAssignment });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ message: "Error updating assignment.", error });
  }
};

// Delete Assignment
const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.status(200).json({ message: "Assignment deleted successfully." });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ message: "Error deleting assignment.", error });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByClass,
  updateAssignment,
  deleteAssignment,
};
