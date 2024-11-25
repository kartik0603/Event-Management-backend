const multer = require("multer");
const path = require("path");

// file types
const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

//  storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //  `uploads` folder exists
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter for
const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, JPG, and GIF are allowed."),
      false
    );
  }
};

const uploader = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = uploader.single("image");
