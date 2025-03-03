const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signUp = async (req, res, next) => {
  console.log("hll");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Your data is invalid, please check it out", 422)
    );
  }

  const { name, email, password, role } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed, please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User is already present", 422);
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const currentTime = new Date();

  const createdUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
    role: role,
    createdAt: currentTime,
    updatedAt: currentTime,
  });

  try {
    await createdUser.save();
    const payload = { userId: createdUser._id, role: createdUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token: token, user: createdUser });
  } catch (err) {
    console.error("Error saving user:", err); // Log the error for debugging
    const error = new HttpError("Signup failed, please try again", 500);
    return next(error);
  }

  // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.signUp = signUp;

// Login function
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = await User.findOne({ email: email });

  if (!identifiedUser) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  const isValidPassword = await bcrypt.compare(
    password,
    identifiedUser.password
  );

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  const token = jwt.sign(
    { userId: identifiedUser._id, role: identifiedUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // You may want to send back user data or a token upon successful login
  res.json({ token: token, user: identifiedUser });
};

exports.signUp = signUp;
exports.login = login;
