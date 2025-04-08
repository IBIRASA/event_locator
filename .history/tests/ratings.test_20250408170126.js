const request = require("supertest");
const { app, server } = require("../app");
const pool = require("../utils/database");
const { generateToken } = require("../models/user");

describe("Favorite Routes", () => {
  let testUser;
  let testEvent;
  let token;

  beforeAll(async () => {
    testUser = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ('favoriteUser', 'hash') RETURNING *"
    );
    testUser = testUser.rows[0];
    testEvent = await pool.query(
      "INSERT INTO events (title, description, latitude, longitude, date_time, categories, user_id) VALUES ('Favorite Test', 'desc', 0, 0, NOW(), 'test', $1) RETURNING *",
      [testUser.id]
    );
    testEvent = testEvent.rows[0];
    token = "Bearer " + generateToken(testUser); 
  });

  afterAll(async () => {
    await pool.query("DELETE FROM favorite_events WHERE user_id = $1", [
      testUser.id,
    ]);
    await pool.query("DELETE FROM events WHERE id = $1", [testEvent.id]);
    await pool.query("DELETE FROM users WHERE id = $1", [testUser.id]);
    await pool.end();
    server.close();
  });

  it("should add a favorite event", async () => {
    const response = await request(server)
      .post("/favorites")
      .set("Authorization", token) 
      .send({
        eventId: testEvent.id,
        userId: testUser.id,
      });
    expect(response.statusCode).toBe(201);
  });

  it("should get favorite events by user ID", async () => {
    const response = await request(server)
      .get(`/favorites/${testUser.id}`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should remove a favorite event", async () => {
    const response = await request(server)
      .delete("/favorites")
      .set("Authorization", token)
      .send({
        eventId: testEvent.id,
        userId: testUser.id,
      });
    expect(response.statusCode).toBe(200);
  });
});
