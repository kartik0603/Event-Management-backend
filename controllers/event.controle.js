const Event = require("../models/event.schema.js");
const RSVP = require("../models/rsvp.schema.js");
const mongoose = require("mongoose");

// Create an Event
const createEvent = async (req, res) => {
    try {
      const { title, description, date, location, maxAttendees, eventType } = req.body;
  
    
      if (!title || !description || !date || !location || !maxAttendees || !eventType) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const eventDate = new Date(date);
      console.log("Parsed event date:", eventDate);  
  
     
      if (isNaN(eventDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format. Ensure it is in ISO 8601 format." });
      }
  
      
      if (eventDate < new Date()) {
        return res.status(400).json({ message: "Event date must be in the future." });
      }
  

      const event = new Event({
        title,
        description,
        date: eventDate, 
        location,
        maxAttendees,
        eventType,
        creator: req.user.id,
        image: req.file ? req.file.path : undefined,  
      });
  
     
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

   
    const query = {};
    if (date) query.date = { $gte: new Date(date) }; 
    if (location) query.location = new RegExp(location, "i"); 
    if (eventType) query.eventType = eventType;

    
    const skip = (page - 1) * limit;

    // Events with RSVP 
    const events = await Event.find(query)
      .populate("creator", "name email") 
      .sort({ date: 1 }) 
      .skip(skip)
      .limit(Number(limit))
      .lean(); 

    // Add RSVP 
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
     
      const id = req.params.id.trim();
  
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid event ID." });
      }
  
      const event = await Event.findById(id)
        .populate("creator", "name email")
        .lean(); 
  
      if (!event) {
        return res.status(404).json({ message: "Event not found." });
      }
  
   
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
