const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // generate unique filename
  },
});

// File filter to accept only certain formats
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|zip|jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only pdf, zip, jpg, jpeg, png formats are allowed!"));
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // limit to 10MB
  fileFilter: fileFilter,
});

module.exports = upload;
