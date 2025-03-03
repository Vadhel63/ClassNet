// const express = require("express");
// const router = express.Router();
// const Class = require("./../models/Class");
// const { createClass } = require("../Controllers/classController");
// const auth = require("../middleware/auth");
// const { verifyTeacher } = require("../middleware/authMiddleware");
// // Create a new class
// router.post("/create",  auth, createClass);

// // Get classes by teacher ID
// router.get("/teacher/:teacherId", async (req, res) => {
//   try {
//     const teacherId = req.params.teacherId;
//     const response = await Class.find({ teacherId: teacherId });
//     console.log("Classes fetched successfully");
//     res.status(200).json(response);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server error", error: err });
//   }
// });

// // Get a single class by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const classId = req.params.id;
//     const response = await Class.findById(classId)
//       .populate("teacherId")
//       .populate("students")
//       .populate("assignments")
//       .populate("announcements");
//     if (!response) {
//       res.status(404).json({ message: "Class not found" });
//     } else {
//       console.log("Class fetched successfully");
//       res.status(200).json(response);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server error", error: err });
//   }
// });

// // Get all classes
// router.get("/", async (req, res) => {
//   try {
//     const classes = await Class.find();
//     //   .populate("teacherId")
//     //   .populate("students")
//     //   .populate("assignments")
//     //   .populate("announcements");
//     console.log("Classes fetched successfully");
//     res.status(200).json(classes);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server error", error: err });
//   }
// });

// // Update a class by ID
// router.put("/:id", async (req, res) => {
//   try {
//     const classId = req.params.id;
//     const updatedClassData = req.body;
//     const response = await Class.findByIdAndUpdate(classId, updatedClassData, {
//       new: true, // Return the updated document
//       runValidators: true, // Validate the updated document
//     });
//     if (!response) {
//       res.status(404).json({ message: "Class not found" });
//     } else {
//       console.log("Class data updated successfully");
//       res.status(200).json(response);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server error", error: err });
//   }
// });

// // Delete a class by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const classId = req.params.id;
//     const response = await Class.findByIdAndDelete(classId);
//     if (!response) {
//       res.status(404).json({ message: "Class not found" });
//     } else {
//       console.log("Class data deleted successfully");
//       res.status(200).json({ message: "Class successfully deleted" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server error", error: err });
//   }
// });

// module.exports = router;
const Class = require("../models/Class");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// Import necessary models
const User = require("../models/User");
const Admin = require("../models/Admin");

// Join Class Route
router.post("/join", auth, async (req, res) => {
  console.log("server");
  try {
    const studentId = req.userData.userId; // Get student ID from auth middleware
    const { classCode, collegeName } = req.body;

    // Fetch the class to join by classCode
    const classToJoin = await Class.findOne({ classCode }).populate({
      path: "teachers",
      populate: {
        path: "addedByAdmin", // Populate the admin who added the teacher
        model: "Admin",
      },
    });

    // Check if class exists
    if (!classToJoin) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Fetch the user who is trying to join
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure there's at least one teacher with an admin reference
    if (!classToJoin.teachers || classToJoin.teachers.length === 0) {
      return res
        .status(404)
        .json({ message: "No teachers assigned to this class" });
    }

    const teacherWithAdmin = classToJoin.teachers.find(
      (teacher) => teacher.addedByAdmin
    );

    if (!teacherWithAdmin) {
      return res.status(404).json({
        message: "No admin assigned to teachers in this class",
      });
    }

    // Get the admin's emailPattern and collegeName
    const admin = teacherWithAdmin.addedByAdmin;
    const emailPattern = admin.emailPattern || "@gmail.com"; // Use default if not provided
    const userEmail = user.email;

    console.log(`Email pattern from admin: ${emailPattern}`);

    // Check if the user's email matches the expected pattern
    if (!userEmail.endsWith(emailPattern)) {
      return res
        .status(400)
        .json({ message: `Email must end with ${emailPattern}` });
    }

    // Validate college name
    if (admin.collegeName !== collegeName) {
      return res.status(400).json({ message: "College name does not match" });
    }

    // Add student to class
    if (!classToJoin.students.includes(studentId)) {
      classToJoin.students.push(studentId);
      await classToJoin.save();

      console.log("Successfully joined the class");
      return res.status(200).json(classToJoin);
    } else {
      return res.status(400).json({ message: "You are already in this class" });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
});
const {
  getClassesById,
  updateClass,
  deleteClass,
  createClass,
  getClassesByTeacherId,
  addStudentToClass,
  removeStudentFromClass,
  addTeacherToClass,
  removeTeacherFromClass,
} = require("../Controllers/classController");

// Create a new class
router.delete("/:id", auth, deleteClass);
router.put(":/id", auth, updateClass);
router.post("/create", auth, createClass);
router.post("/add-teacher", auth, addTeacherToClass);
// Get classes created by the authenticated teacher
router.get("/my-classes", auth, getClassesByTeacherId);

// Add student to a class
router.post("/add-student", addStudentToClass);

// Remove student from a class
router.post("/:id/:studentId", removeStudentFromClass);
router.post("/remove-teacher", removeTeacherFromClass);
// Other existing routes remain the same
// ...
// studentRoutes.js

// Join a class by class code
// router.post("/join", auth, async (req, res) => {
//   console.log("server");
//   try {
//     studentId = req.userData.userId;
//     const { classCode } = req.body;
//     const classToJoin = await Class.findOne({ classCode });

//     if (!classToJoin) {
//       return res.status(404).json({ message: "Class not found" });
//     }

//     // Assuming you have a students field in the Class model
//     classToJoin.students.push(studentId);
//     await classToJoin.save();

//     console.log("Successfully joined the class");
//     res.status(200).json(classToJoin);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server error", error: err });
//   }
// });

router.get("/:id", getClassesById);

// studentRoutes.js

// Get classes by student ID
router.get("/", auth, async (req, res) => {
  try {
    const studentId = req.userData.userId;
    const classes = await Class.find({ students: studentId }).populate(
      "teachers"
    );
    console.log("milan");
    console.log("Classes fetched successfully");
    res.status(200).json(classes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
