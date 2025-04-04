const pool = require("../utils/database");

async function createRating(eventId, userId, rating, comment) {
  const result = await pool.query(
    "INSERT INTO ratings (event_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
    [eventId, userId, rating, comment]
  );
  return result.rows[0];
}

async function getRatingsByEventId(eventId) {
  const result = await pool.query("SELECT * FROM ratings WHERE event_id = $1", [
    eventId,
  ]);
  return result.rows;
}

module.exports = { createRating, getRatingsByEventId };
