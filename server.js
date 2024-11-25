// const express = require("express");
// require("dotenv").config();
// const connectDB = require("./config/db.js");
// const cors = require("cors");
// const eventRouter = require("./routes/event.route.js");
// const userRouter = require("./routes/user.route.js");

// const PORT = process.env.PORT || 5000;

// const app = express();
// app.use(cors());

// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// app.use("/api/events", eventRouter);
// app.use("/api/users", userRouter);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   connectDB();
// });


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db.js");
const eventRouter = require("./routes/event.route.js");
const userRouter = require("./routes/user.route.js");
const rsvpRouter = require("./routes/rsvp.route.js");


dotenv.config();

const app = express();

// Middleware for security
app.use(helmet());


app.use(cors({
  origin: process.env.CLIENT_URL || "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true,
}));

// Logging Development 
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


app.use(express.json()); 


app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/events", eventRouter);
app.use("/api/users", userRouter);
app.use("/api/rsvp", rsvpRouter);


app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); 
  }
});
