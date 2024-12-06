const RSVP = require("../models/rsvp.schema.js");
const Event = require("../models/event.schema.js");
const mongoose = require("mongoose");


const rsvpToEvent = async (req, res) => {
    try {
      const { event, status } = req.body;
  
     
      if (!event || !["Going", "Not Going"].includes(status)) {
        return res.status(400).json({ message: "Invalid event ID or status." });
      }
  
   
      if (!mongoose.Types.ObjectId.isValid(event)) {
        return res.status(400).json({ message: "Invalid event ID format." });
      }
  
      const foundEvent = await Event.findById(event);
      if (!foundEvent) {
        return res.status(400).json({ message: "Event not found." });
      }
  
      //RSVP is for future Events
      if (new Date(foundEvent.date) < new Date()) {
        return res.status(400).json({ message: "Cannot RSVP for past events." });
      }
  
      //   event is full is or Not
      const rsvpCount = await RSVP.countDocuments({ event, status: "Going" });
      if (status === "Going" && rsvpCount >= foundEvent.maxAttendees) {
        return res.status(400).json({ message: "Event is full." });
      }
  
      // Check  user RSVP
      const existingRSVP = await RSVP.findOne({ event, user: req.user.id });
      if (existingRSVP) {
        existingRSVP.status = status;
        await existingRSVP.save();
        return res.json({ message: "RSVP updated successfully.", rsvp: existingRSVP });
      }
  
      // new RSVP
      const newRSVP = new RSVP({
        event,
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
  

// Get RSVPS user
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

// Get RSVPS Event
const getEventRSVPs = async (req, res) => {
  try {
    const { eventId } = req.params;

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
