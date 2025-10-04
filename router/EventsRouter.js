const express = require("express");
const EventsSchema = require("../Schema/EventsSchema");
const router = express.Router();

router.post("/addEvent", async (req, res) => {
  try {
    const newEvent = await EventsSchema.create(req.body);
    res.status(201).json({
      message: "Event added successfully",
      event: newEvent,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch("/updateEvent/:id", async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const updatedEvent = await EventsSchema.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/deleteEvent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventsSchema.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Event deleted successfully", success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/getEvents", async (req, res) => {
  try {
    const query = {};
    const { isPinned } = req.query;
    if (isPinned) {
      query.isPinned = isPinned == "true" ? true : false;
    }
    const events = (await EventsSchema.find(query)).sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.status(200).json({ events, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/getEvent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await EventsSchema.findById(id);
    res.status(200).json({ event, success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
