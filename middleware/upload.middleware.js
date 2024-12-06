const multer = require("multer");
const path = require("path");


const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // unique filename
    const uniSuff = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniSuff}${ext}`);
  },
});

// File filter for
const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(
      new Error(" Only JPEG, PNG, JPG, and GIF."),
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
