const express = require("express");
const {    createEvent,
    getEvents,
    getEventById,} = require("../controllers/event.controle.js");
const protect = require("../middleware/auth.middleware.js");

const uploader = require("../middleware/upload.middleware.js");

const eventRouter = express.Router();


eventRouter.use(protect);

eventRouter.post("/create" ,protect, uploader, createEvent);
eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);

module.exports = eventRouter;