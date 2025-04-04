const express = require('express');
const router = express.Router();
const { createRating, getRatingsByEventId } = require('../models/rating');
const i18next = require('../utils/i18n');

router.post('/', async (req, res) => {
    try {
        const { eventId, userId, rating, comment } = req.body;
        const newRating = await createRating(eventId, userId, rating, comment);
        res.status(201).json({ message: i18next.t('ratingCreated', { lng: req.i18n.language }) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const ratings = await getRatingsByEventId(eventId);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;