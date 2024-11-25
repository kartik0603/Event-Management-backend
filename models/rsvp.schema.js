const mongoose = require("mongoose");

const rsvpSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Going", "Not Going"], required: true },
});



const RSVP = mongoose.model("RSVP", rsvpSchema);
module.exports = RSVP;
