const RSVP = require("../models/rsvp.schema.js");
const Event = require("../models/event.schema.js");

// RSVP to an Event
const rsvpToEvent = async (req, res) => {
  try {
    const { eventId, status } = req.body;

    // Validate input
    if (!eventId || !["Going", "Not Going"].includes(status)) {
      return res.status(400).json({ message: "Invalid event ID or status." });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Ensure RSVP is for future events only
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: "Cannot RSVP for past events." });
    }

    // Check if the event is full
    const rsvpCount = await RSVP.countDocuments({ event: eventId, status: "Going" });
    if (status === "Going" && rsvpCount >= event.maxAttendees) {
      return res.status(400).json({ message: "Event is full." });
    }

    // Check if user already RSVP'd
    const existingRSVP = await RSVP.findOne({ event: eventId, user: req.user.id });
    if (existingRSVP) {
      // Update existing RSVP
      existingRSVP.status = status;
      await existingRSVP.save();
      return res.json({ message: "RSVP updated successfully.", rsvp: existingRSVP });
    }

    // Create new RSVP
    const newRSVP = new RSVP({
      event: eventId,
      user: req.user.id,
      status,
    });
    await newRSVP.save();

    res.status(201).json({ message: "RSVP created successfully.", rsvp: newRSVP });
  } catch (error) {
    console.error("Error managing RSVP:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get RSVPs for a User
const getUserRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.find({ user: req.user.id })
      .populate("event", "title date location")
      .populate("user", "name email");

    res.json(rsvps);
  } catch (error) {
    console.error("Error fetching user RSVPs:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get RSVPs for an Event
const getEventRSVPs = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Validate event existence
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const rsvps = await RSVP.find({ event: eventId }).populate("user", "name email");

    res.json({ event: event.title, totalRSVPs: rsvps.length, rsvps });
  } catch (error) {
    console.error("Error fetching event RSVPs:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  rsvpToEvent,
  getUserRSVPs,
  getEventRSVPs,
};
