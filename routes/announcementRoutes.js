const express = require("express");
const router = express.Router();
const Announcement = require("./../models/Announcement");

// Create a new announcement
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields (customize according to your schema)
    if (!data.title || !data.content || !data.classId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAnnouncement = new Announcement(data);
    const response = await newAnnouncement.save();
    console.log("Announcement data saved successfully:", response);
    res.status(201).json(response); // 201 Created
  } catch (err) {
    console.error("Error saving announcement:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Get announcements by class ID
router.get("/class/:classId", async (req, res) => {
  try {
    const classId = req.params.classId;
    const response = await Announcement.find({ classId: classId });
    console.log("Announcements fetched successfully for class ID:", classId);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching announcements by class ID:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Get a single announcement by ID
router.get("/:id", async (req, res) => {
  try {
    const announcementId = req.params.id;
    const response = await Announcement.findById(announcementId).populate("classId");
    if (!response) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    console.log("Announcement fetched successfully:", response);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching announcement by ID:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("classId");
    console.log("All announcements fetched successfully");
    res.status(200).json(announcements);
  } catch (err) {
    console.error("Error fetching all announcements:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Update an announcement by ID
router.put("/:id", async (req, res) => {
  try {
    const announcementId = req.params.id;
    const updatedAnnouncementData = req.body;

    // Validate required fields (customize according to your schema)
    if (!updatedAnnouncementData.title || !updatedAnnouncementData.content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const response = await Announcement.findByIdAndUpdate(
      announcementId,
      updatedAnnouncementData,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the updated document
      }
    );
    
    if (!response) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    console.log("Announcement data updated successfully:", response);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error updating announcement:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Delete an announcement by ID
router.delete("/:id", async (req, res) => {
  try {
    const announcementId = req.params.id;
    const response = await Announcement.findByIdAndDelete(announcementId);
    
    if (!response) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    console.log("Announcement data deleted successfully:", announcementId);
    res.status(200).json({ message: "Announcement successfully deleted" });
  } catch (err) {
    console.error("Error deleting announcement:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
