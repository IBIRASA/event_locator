const pool = require("../utils/database");

async function createEvent(
  title,
  description,
  latitude,
  longitude,
  dateTime,
  categories,
  userId
) {
  const result = await pool.query(
    "INSERT INTO events (title, description, latitude, longitude, date_time, categories, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [title, description, latitude, longitude, dateTime, categories, userId]
  );
  return result.rows[0];
}

async function getEvents(latitude, longitude, radius, categories) {
  let query = "SELECT * FROM events";
  const values = [];

  if (latitude && longitude && radius) {
    query += ` WHERE earth_distance(ll_to_earth(latitude, longitude), ll_to_earth($1, $2)) < $3`;
    values.push(latitude, longitude, radius * 1000); // radius in meters
  }

  if (categories) {
    if (latitude && longitude && radius) {
      query += ` AND categories LIKE '%' || $${values.length + 1} || '%'`;
    } else {
      query += ` WHERE categories LIKE '%' || $${values.length + 1} || '%'`;
    }
    values.push(categories);
  }

  const result = await pool.query(query, values);
  return result.rows;
}

async function updateEvent(
  eventId,
  title,
  description,
  latitude,
  longitude,
  dateTime,
  categories
) {
  const result = await pool.query(
    "UPDATE events SET title = $2, description = $3, latitude = $4, longitude = $5, date_time = $6, categories = $7 WHERE id = $1 RETURNING *",
    [eventId, title, description, latitude, longitude, dateTime, categories]
  );
  return result.rows[0];
}

async function deleteEvent(eventId) {
  const result = await pool.query(
    "DELETE FROM events WHERE id = $1 RETURNING *",
    [eventId]
  );
  return result.rows[0];
}

async function getEventById(eventId) {
  const result = await pool.query("SELECT * FROM events WHERE id = $1", [
    eventId,
  ]);
  return result.rows[0];
}

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventById,
};
