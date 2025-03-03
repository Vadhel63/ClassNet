const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("./../models/User");
const { check } = require("express-validator");
const userController = require("../Controllers/UserController");
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password").populate("classes");
    console.log("data fetched succesfully");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error, "Internal Server Error");
  }
});

// router.get("/profile",auth,async (req, res, next) => {
//   try {
//     const user = await User.findById(req.userData.userId).select("-password").populate("classes");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the image is already a full URL, if not, append the host and protocol

//     // Send user data along with the image URL
//   //   res.json({
//   //     name: user.name,
//   //     email: user.email,
//   //     role:user.role,
//   //  // Correctly formatted image URL
//   //   });

//   res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userData.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//fetch user by its role
router.get("/:role", async (req, res) => {
  try {
    const role = req.params.role;
    if (["teacher", "student", "admin"].includes(role)) {
      const response = await User.find({ role: role }, "-password").populate(
        "classes"
      );
      console.log("Users fetched successfully");
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Invalid role type" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

//Update user by id
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;
    const response = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the updated document
    });
    if (!response) {
      res.status(404).json({ message: "User not found" });
    } else {
      console.log("User data updated successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await User.findByIdAndDelete(userId);
    if (!response) {
      res.status(404).json({ message: "User not found" });
    } else {
      console.log("User data deleted successfully");
      res.status(200).json({ message: "User successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});
// router.post("/", async (req, res) => {
//   try {
//     const user = new User(req.body);
//     const response = await user.save();
//     res.status(201).json(response);
//     console.log("data saved succesfully");
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error, "Internal Server Error");
//   }
// });
console.log("abcd");
router.post(
  "/register",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("role").not().isEmpty(),
  ],
  userController.signUp
);

router.post("/login", userController.login);

module.exports = router;
