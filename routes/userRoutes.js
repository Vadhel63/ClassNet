const express = require("express");
const router = express.Router();
const User = require("./../models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log("data fetched succesfully");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error, "Internal Server Error");
  }
});
//fetch user by its role
router.get("/:role", async (req, res) => {
    try {
      const role = req.params.role;
      if (["teacher", "student", "admin"].includes(role)) {
        const response = await User.find({ role: role });
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
      const response = await User.findByIdAndUpdate(
        userId,
        updatedUserData,
        {
          new: true, // Return the updated document
          runValidators: true, // Validate the updated document
        }
      );
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
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const response = await user.save();
    res.status(201).json(response);
    console.log("data saved succesfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error, "Internal Server Error");
  }
});

module.exports = router;
