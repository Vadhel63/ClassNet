const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const auth = require("../middleware/auth");
const {
  adminSignUp,
  adminLogin,
  addTeacher,
  deleteTeacher,
  getAllTeacher,
  getProfile,
  UpdateProfile,
  deleteProfile,
} = require("../Controllers/AdminController");

router.post(
  "/register",
  [
    check("adminName").not().isEmpty(),
    check("adminEmail").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("collegeName").not().isEmpty(),
    check("location").not().isEmpty(),
  ],
  adminSignUp
);
router.post(
  "/login",
  [
    check("adminEmail").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  adminLogin
);

router.delete("/teachers/:id", auth, deleteTeacher);
router.post("/add-teacher", auth, addTeacher);
router.get("/teachers", auth, getAllTeacher);

router.get("/profile", auth, getProfile);

router.put("/profile", auth, UpdateProfile);

// Delete Admin Account
router.delete("/delete-account", auth, deleteProfile);
module.exports = router;
