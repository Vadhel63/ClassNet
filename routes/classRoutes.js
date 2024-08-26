const express = require("express");
const router = express.Router();
const Class = require("./../models/Class");

// Create a new class
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newClass = new Class(data);
    const response = await newClass.save();
    console.log("Class data saved successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get classes by teacher ID
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const response = await Class.find({ teacherId: teacherId });
    console.log("Classes fetched successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get a single class by ID
router.get("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    const response = await Class.findById(classId)
      .populate("teacherId")
      .populate("students")
      .populate("assignments")
      .populate("announcements");
    if (!response) {
      res.status(404).json({ message: "Class not found" });
    } else {
      console.log("Class fetched successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get all classes
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find();
    //   .populate("teacherId")
    //   .populate("students")
    //   .populate("assignments")
    //   .populate("announcements");
    console.log("Classes fetched successfully");
    res.status(200).json(classes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Update a class by ID
router.put("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    const updatedClassData = req.body;
    const response = await Class.findByIdAndUpdate(classId, updatedClassData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updated document
    });
    if (!response) {
      res.status(404).json({ message: "Class not found" });
    } else {
      console.log("Class data updated successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Delete a class by ID
router.delete("/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    const response = await Class.findByIdAndDelete(classId);
    if (!response) {
      res.status(404).json({ message: "Class not found" });
    } else {
      console.log("Class data deleted successfully");
      res.status(200).json({ message: "Class successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
