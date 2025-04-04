const express = require("express");
const router = express.Router();
const {
  addFavoriteEvent,
  getFavoriteEventsByUserId,
  removeFavoriteEvent,
} = require("../models/favorite");
const i18next = require("../utils/i18n");

router.post("/", async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    await addFavoriteEvent(eventId, userId);
    res
      .status(201)
      .json({
        message: i18next.t("favoriteAdded", { lng: req.i18n.language }),
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await getFavoriteEventsByUserId(userId);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    await removeFavoriteEvent(eventId, userId);
    res.json({
      message: i18next.t("favoriteRemoved", { lng: req.i18n.language }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
