const Class = require("../models/Class");
const User = require("../models/User");

// Function to generate random class code
const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a 6-character code
};

// Controller to handle creating a class
const createClass = async (req, res) => {
  const { name, description, schedule } = req.body;
  const teacherId = req.userData.userId; // Assuming the teacher's user ID is available in req.user

  try {
    const classCode = generateClassCode();

    // Create a new class
    const newClass = new Class({
      name,
      description,
      schedule,
      classCode,
      teachers: [teacherId], // Initialize with the creator's ID
    });

    await newClass.save();
    res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Failed to create class" });
  }
};

// Get classes by teacher ID
const getClassesByTeacherId = async (req, res) => {
  console.log("ckass");
  const teacherId = req.userData.userId; // Get the teacher ID from the authenticated user

  try {
    const classes = await Class.find({ teachers: teacherId });
    res.status(200).json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};
const getClassesById = async (req, res) => {
  console.log("inside perticular class");
  const { id } = req.params;
  try {
    const class1 = await Class.findById(id).populate("students");
    res.status(200).json(class1);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};
// Update class to add a student

const addStudentToClass = async (req, res) => {
  const { classId, studentId } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { students: studentId } }, // Add the student ID to the students array
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(updatedClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

// Update class to remove a student
const removeStudentFromClass = async (req, res) => {
  const { id, studentId } = req.params;
  console.log(id);
  console.log(studentId);
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { $pull: { students: studentId } }, // Remove the student ID from the students array
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(updatedClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};
const addTeacherToClass = async (req, res) => {
  const { Id, teacherId } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $addToSet: { teachers: teacherId } },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(updatedClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

// Remove a teacher from a class
const removeTeacherFromClass = async (req, res) => {
  const { classId, teacherId } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { $pull: { teachers: teacherId } },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(updatedClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

const updateClass = async (req, res) => {
  const { id } = req.params;
  const { name, description, schedule } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { name, description, schedule },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    return res
      .status(200)
      .json({ message: "Class updated successfully.", class: updatedClass });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating class." });
  }
};

// Delete Class
const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    return res.status(200).json({ message: "Class deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting class." });
  }
};
// Export the functions to be used in routes
module.exports = {
  getClassesById,
  createClass,
  updateClass,
  deleteClass,
  getClassesByTeacherId,
  addStudentToClass,
  addTeacherToClass,
  removeTeacherFromClass,
  removeStudentFromClass,
};
