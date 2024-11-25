const express = require("express");
const rsvpRouter = express.Router();

const protect = require("../middleware/auth.middleware.js");
const  {
    rsvpToEvent,
    getUserRSVPs,
    getEventRSVPs,
  } = require("../controllers/rsvp.controler.js");

rsvpRouter.use(protect);

rsvpRouter.post("/", rsvpToEvent);
rsvpRouter.get("/user", getUserRSVPs);
rsvpRouter.get("/event/:eventId", getEventRSVPs);

module.exports = rsvpRouter;
