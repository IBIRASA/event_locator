const pool = require('../utils/database');

async function addFavoriteEvent(eventId, userId) {
    const result = await pool.query(
        'INSERT INTO favorite_events (event_id, user_id) VALUES ($1, $2) RETURNING *',
        [eventId, userId]
    );
    return result.rows[0];
}

async function getFavoriteEventsByUserId(userId) {
    const result = await pool.query('SELECT events.* FROM favorite_events JOIN events ON favorite_events.event_id = events.id WHERE favorite_events.user_id = $1', [userId]);
    return result.rows;
}

async function removeFavoriteEvent(eventId, userId) {
    const result = await pool.query('DELETE FROM favorite_events WHERE event_id = $1 AND user_id = $2 RETURNING *', [eventId, userId]);
    return result.rows;
}

module.exports = { addFavoriteEvent, getFavoriteEventsByUserId, removeFavoriteEvent };