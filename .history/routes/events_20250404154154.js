const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventById,
} = require("../models/event");
const calculateDistance = require("../utils/distance");
const i18next = require("../utils/i18n");

router.post("/", async (req, res) => {
  try {
    const { title, description, latitude, longitude, dateTime, categories } =
      req.body;
    const event = await createEvent(
      title,
      description,
      latitude,
      longitude,
      dateTime,
      categories,
      req.user.id
    );
    res
      .status(201)
      .json({
        message: i18next.t("eventCreated", {
          lng: req.headers["accept-language"] || "en",
        }),
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { latitude, longitude, radius, categories } = req.query;
    const events = await getEvents(latitude, longitude, radius, categories);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, latitude, longitude, dateTime, categories } =
      req.body;
    const event = await updateEvent(
      eventId,
      title,
      description,
      latitude,
      longitude,
      dateTime,
      categories
    );
    if (event) {
      res.json({
        message: i18next.t("eventUpdated", {
          lng: req.headers["accept-language"] || "en",
        }),
      });
    } else {
      res
        .status(404)
        .json({
          message: i18next.t("eventNotFound", {
            lng: req.headers["accept-language"] || "en",
          }),
        });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await deleteEvent(eventId);
    if (event) {
      res.json({
        message: i18next.t("eventDeleted", {
          lng: req.headers["accept-language"] || "en",
        }),
      });
    } else {
      res
        .status(404)
        .json({
          message: i18next.t("eventNotFound", {
            lng: req.headers["accept-language"] || "en",
          }),
        });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await getEventById(eventId);
    if (event) {
      res.json(event);
    } else {
      res
        .status(404)
        .json({
          message: i18next.t("eventNotFound", {
            lng: req.headers["accept-language"] || "en",
          }),
        });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
