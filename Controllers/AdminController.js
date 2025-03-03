const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error"); // Assuming HttpError is a custom error handler
const User = require("../models/User");

// Admin Registration (SignUp)
const adminSignUp = async (req, res, next) => {
  console.log("Admin signup attempt...");

  // Validate incoming request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Your data is invalid, please check it out", 422)
    );
  }

  const {
    adminName,
    adminEmail,
    password,
    collegeName,
    location,
    emailPattern,
  } = req.body;

  // **Additional validation for email field**
  if (!adminEmail || adminEmail.trim() === "") {
    return next(
      new HttpError("Email is required and cannot be null or empty", 400)
    ); // Return early if email is missing
  }

  let existingAdmin;
  try {
    // Check if the admin already exists by querying the "adminEmail" field
    existingAdmin = await Admin.findOne({ adminEmail });
  } catch (err) {
    console.error("Error checking existing admin:", err);
    return next(new HttpError("Signup failed, please try again", 500));
  }

  // If admin already exists
  if (existingAdmin) {
    return next(new HttpError("Admin is already registered", 422));
  }

  // Hash the password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.error("Error hashing password:", err);
    return next(new HttpError("Signup failed, please try again", 500));
  }

  // Create a new admin
  const createdAdmin = new Admin({
    adminName,
    adminEmail,
    password: hashedPassword,
    collegeName,
    location,
    emailPattern: emailPattern || "@gmail.com",
  });
  console.log(adminEmail);
  try {
    // Save the new admin to the database
    await createdAdmin.save();
    console.log("Admin object to save:", createdAdmin);

    const payload = { userId: createdAdmin._id, role: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, user: createdAdmin });
  } catch (err) {
    console.error("Error saving admin:", err);
    if (err.code === 11000) {
      // Duplicate key error code
      return next(new HttpError("Email already in use", 422));
    }
    return next(new HttpError("Signup failed, please try again", 500));
  }
};

//getAllteacher
const getAllTeacher = async (req, res, next) => {
  try {
    const adminId = req.userData.userId; // Get admin ID from the decoded token
    console.log("Fetching teachers added by admin with ID:", adminId);

    const teachers = await User.find({
      role: "teacher",
      addedByAdmin: adminId,
    });

    if (!teachers || teachers.length === 0) {
      return res
        .status(404)
        .json({ message: "No teachers found for this admin" });
    }

    res.status(200).json({ teachers });
  } catch (err) {
    console.error("Error fetching teachers:", err);
    const error = new HttpError("Error fetching teachers", 500);
    return next(error);
  }
};
// Admin Login
const adminLogin = async (req, res, next) => {
  const { adminEmail, password } = req.body;

  let identifiedAdmin;
  try {
    identifiedAdmin = await Admin.findOne({ adminEmail });
  } catch (err) {
    const error = new HttpError("Login failed, please try again", 500);
    return next(error);
  }

  if (!identifiedAdmin) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  const isValidPassword = await bcrypt.compare(
    password,
    identifiedAdmin.password
  );

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  const token = jwt.sign(
    { userId: identifiedAdmin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, user: identifiedAdmin });
};

const addTeacher = async (req, res, next) => {
  const { name, email, password } = req.body; // Extract teacher data from request body
  const adminId = req.userData.userId; // Get admin ID from token

  try {
    // Find the admin to get the email pattern
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return next(new HttpError("Admin not found", 404));
    }

    // Validate the email against the admin's email pattern
    const emailPattern = new RegExp(`^[a-zA-Z0-9._%+-]+${admin.emailPattern}$`);
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: `Email must follow the pattern ${admin.emailPattern}`,
      });
    }

    // Check if the teacher already exists
    const existingTeacher = await User.findOne({ email });
    if (existingTeacher) {
      return res
        .status(409)
        .json({ message: "A teacher with this email already exists" });
    }

    // Hash the password before saving (optional)
    const hashedPassword = await bcrypt.hash(password, 12);
    currentTime = new Date();
    // Create a new teacher
    const newTeacher = new User({
      name,
      email,
      password: hashedPassword,
      role: "teacher", // Assign role as teacher
      addedByAdmin: adminId,
      updatedAt: currentTime,
      createdAt: currentTime,
    });

    // Save the teacher to the database
    await newTeacher.save();
    res.status(201).json({
      message: "Teacher added successfully",
      teacherId: newTeacher._id,
    });
  } catch (err) {
    console.error("Error adding teacher:", err);
    return next(new HttpError("Adding teacher failed", 500));
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const adminId = req.userData.userId; // Get admin ID from token

    // Find the teacher by ID and ensure they were added by the logged-in admin
    const teacher = await User.findOne({
      _id: req.params.id,
      addedByAdmin: adminId,
    });

    if (!teacher) {
      return res
        .status(404)
        .json({ message: "Teacher not found or not added by this admin" });
    }

    // Delete the teacher
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting teacher", error });
  }
};

getProfile = async (req, res) => {
  try {
    const user = await Admin.findById(req.userData.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const UpdateProfile = async (req, res) => {
  const { adminName, collegeName, location, emailPattern } = req.body;
  try {
    const admin = await Admin.findById(req.userData.userId); // Assuming you store admin ID in JWT
    if (!admin) return res.status(404).send("Admin not found");

    admin.adminName = adminName;
    admin.collegeName = collegeName;
    admin.location = location;
    admin.emailPattern = emailPattern;

    await admin.save();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.userData.userId);
    const user = await User.findOneAndDelete({ addedByAdmin: admin._id });
    if (!admin) return res.status(404).send("Admin not found");
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
module.exports = {
  adminSignUp,
  adminLogin,
  getAllTeacher,
  deleteTeacher,
  addTeacher,
  getProfile,
  UpdateProfile,
  deleteProfile,
};
