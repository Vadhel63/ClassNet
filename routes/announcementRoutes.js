const express = require("express");
const router = express.Router();
const Announcement = require("./../models/Announcement");

// Create a new announcement
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newAnnouncement = new Announcement(data);
    const response = await newAnnouncement.save();
    console.log("Announcement data saved successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get announcements by class ID
router.get("/class/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;
    const response = await Announcement.find({ classId: classId });
    console.log("Announcements fetched successfully");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get a single announcement by ID
router.get("/:id", async (req, res) => {
  try {
    const announcementId = req.params.id;
    const response = await Announcement.findById(announcementId).populate(
      "classId"
    );
    if (!response) {
      res.status(404).json({ message: "Announcement not found" });
    } else {
      console.log("Announcement fetched successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("classId");
    console.log("Announcements fetched successfully");
    res.status(200).json(announcements);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Update an announcement by ID
router.put("/:id", async (req, res) => {
  try {
    const announcementId = req.params.id;
    const updatedAnnouncementData = req.body;
    const response = await Announcement.findByIdAndUpdate(
      announcementId,
      updatedAnnouncementData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated document
      }
    );
    if (!response) {
      res.status(404).json({ message: "Announcement not found" });
    } else {
      console.log("Announcement data updated successfully");
      res.status(200).json(response);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Delete an announcement by ID
router.delete("/:id", async (req, res) => {
  try {
    const announcementId = req.params.id;
    const response = await Announcement.findByIdAndDelete(announcementId);
    if (!response) {
      res.status(404).json({ message: "Announcement not found" });
    } else {
      console.log("Announcement data deleted successfully");
      res.status(200).json({ message: "Announcement successfully deleted" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
