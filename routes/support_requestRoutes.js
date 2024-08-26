const express = require("express");
const router = express.Router();
const SupportRequest = require("./../models/support_request");

// Create a new support request
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newSupportRequest = new SupportRequest(data);
    const response = await newSupportRequest.save();
    console.log("Support request created successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get all support requests
router.get("/", async (req, res) => {
  try {
    const supportRequests = await SupportRequest.find().populate("userId");
    console.log("Support requests fetched successfully");
    res.status(200).json(supportRequests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get support requests by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const supportRequests = await SupportRequest.find({ userId: userId });
    console.log("Support requests fetched successfully for user");
    res.status(200).json(supportRequests);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get a single support request by ID
router.get("/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const supportRequest = await SupportRequest.findById(requestId).populate(
      "userId"
    );
    if (!supportRequest) {
      res.status(404).json({ message: "Support request not found" });
    } else {
      console.log("Support request fetched successfully");
      res.status(200).json(supportRequest);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Update a support request by ID
router.put("/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const updatedSupportRequestData = req.body;
    const response = await SupportRequest.findByIdAndUpdate(
      requestId,
      updatedSupportRequestData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated document
      }
    );
    if (!response) {
      res.status(404).json({ message: "Support request not found" });
    } else {
      console.log("Support request updated successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Delete a support request by ID
router.delete("/:id", async (req, res) => {
  try {
    const requestId = req.params.id;
    const response = await SupportRequest.findByIdAndDelete(requestId);
    if (!response) {
      res.status(404).json({ message: "Support request not found" });
    } else {
      console.log("Support request deleted successfully");
      res.status(200).json({ message: "Support request successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
