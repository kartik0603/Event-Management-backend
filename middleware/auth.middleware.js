const jwt = require("jsonwebtoken");
const User = require("../models/user.schema.js"); 
require("dotenv").config();

const protect = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request object (req.user)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    next();
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(401).json({ message: "Not Authorized, Token Failed" });
  }
};

module.exports = protect;