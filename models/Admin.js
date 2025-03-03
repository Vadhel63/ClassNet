const mongoose = require("mongoose");

// Define Admin Schema
const AdminSchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  collegeName: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  emailPattern: {
    type: String,
    default: "@gmail.com", // Default to @gmail.com if not provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to delete associated users when an admin is deleted
AdminSchema.pre("remove", async function (next) {
  try {
    // Delete users associated with this admin
    await mongoose.model("User").deleteMany({ addedByAdmin: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

// Export the Admin model
module.exports = mongoose.model("Admin", AdminSchema);
