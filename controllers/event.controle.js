const Event = require("../models/event.schema.js");
const RSVP = require("../models/rsvp.schema.js");
const mongoose = require("mongoose");

// Create an Event
const createEvent = async (req, res) => {
    try {
      const { title, description, date, location, maxAttendees, eventType } = req.body;
  
      // Validate required fields
      if (!title || !description || !date || !location || !maxAttendees || !eventType) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Parse and validate the date
      const eventDate = new Date(date);
      console.log("Parsed event date:", eventDate);  // Log for debugging
  
      // Check if the date is valid
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format. Ensure it is in ISO 8601 format." });
      }
  
      // Ensure the event date is in the future
      if (eventDate < new Date()) {
        return res.status(400).json({ message: "Event date must be in the future." });
      }
  
      // Create the event object
      const event = new Event({
        title,
        description,
        date: eventDate,  // Valid event date
        location,
        maxAttendees,
        eventType,
        creator: req.user.id,
        image: req.file ? req.file.path : undefined,  // Save image if uploaded
      });
  
      // Save the event to the database
      await event.save();
  
      res.status(201).json({ message: "Event created successfully.", event });
    } catch (error) {
      console.error("Error creating event:", error.message);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

  

// Get Events with RSVP Details
const getEvents = async (req, res) => {
  try {
    const { date, location, eventType, page = 1, limit = 10 } = req.query;

    // Build query object
    const query = {};
    if (date) query.date = { $gte: new Date(date) }; // Filter events in the future
    if (location) query.location = new RegExp(location, "i"); // Case-insensitive location search
    if (eventType) query.eventType = eventType;

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch events with RSVP details
    const events = await Event.find(query)
      .populate("creator", "name email") // Populate creator details
      .sort({ date: 1 }) // Sort by event date
      .skip(skip)
      .limit(Number(limit))
      .lean(); // Use lean to modify results before sending

    // Add RSVP details for each event
    const eventsWithRSVPs = await Promise.all(
      events.map(async (event) => {
        const rsvpCount = await RSVP.countDocuments({ event: event._id, status: "Going" });
        return {
          ...event,
          rsvpCount,
          isFull: rsvpCount >= event.maxAttendees,
        };
      })
    );

    // Total count of matching events
    const totalEvents = await Event.countDocuments(query);

    res.json({
      total: totalEvents,
      page,
      pages: Math.ceil(totalEvents / limit),
      events: eventsWithRSVPs,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get Single Event with RSVP Details
const getEventById = async (req, res) => {
    try {
      // Trim 
      const id = req.params.id.trim();
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid event ID." });
      }
  
      const event = await Event.findById(id)
        .populate("creator", "name email")
        .lean(); // Convert Mongoose document to plain object
  
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }
  
      // Fetch RSVP details for the event
      const rsvpDetails = await RSVP.find({ event: id }).populate("user", "name email");
  
      res.json({ ...event, rsvpDetails });
    } catch (error) {
      console.error("Error fetching event details:", error.message);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

module.exports = {
  createEvent,
  getEvents,
  getEventById,
};
