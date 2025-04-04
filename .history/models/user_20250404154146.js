const pool = require("../utils/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function createUser(
  username,
  password,
  latitude,
  longitude,
  preferredCategories,
  language
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (username, password_hash, latitude, longitude, preferred_categories, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      username,
      hashedPassword,
      latitude,
      longitude,
      preferredCategories,
      language,
    ]
  );
  return result.rows[0];
}

async function findUserByUsername(username) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = { createUser, findUserByUsername, generateToken };
