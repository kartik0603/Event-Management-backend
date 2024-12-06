


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

app.use(morgan("dev"));
app.use(helmet());


app.use(cors());




app.use(express.json()); 


app.use("/uploads", express.static("uploads"));


app.use("/api/events", eventRouter);
app.use("/api/users", userRouter);
app.use("/api/rsvp", rsvpRouter);

app.get("/", (req, res) => res.json({ message: "Welcome to the Event App API" }));




const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
