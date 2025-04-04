const request = require("supertest");
const { app, server } = require("../app"); // Import app and server
const pool = require("../utils/database");
const { createEvent } = require("../models/event");
const { generateToken } = require("../models/user");

describe("Event Routes", () => {
  let testUser;
  let testEvent;
  let token;

  beforeAll(async () => {
    testUser = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ('eventUser', 'hash') RETURNING *"
    );
    testUser = testUser.rows[0];
    testEvent = await createEvent(
      "Test Event",
      "Description",
      0,
      0,
      new Date(),
      "test",
      testUser.id
    );
    token = generateToken(testUser);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM events WHERE id = $1", [testEvent.id]);
    await pool.query("DELETE FROM users WHERE id = $1", [testUser.id]);
    await pool.end();
    server.close(); // Close the server
  });

  it("should create a new event", async () => {
    const response = await request(server) // Use server
      .post("/events")
      .set("Authorization", token)
      .send({
        title: "New Event",
        description: "New Description",
        latitude: 1,
        longitude: 1,
        dateTime: new Date().toISOString(),
        categories: "test",
      });
    expect(response.statusCode).toBe(201);
    const newEvent = await pool.query("SELECT * FROM events WHERE title = $1", [
      "New Event",
    ]);
    await pool.query("DELETE FROM events WHERE id = $1", [newEvent.rows[0].id]);
  });

  it("should get events", async () => {
    const response = await request(server)
      .get("/events")
      .set("Authorization", token); // Use server
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should update an event", async () => {
    const response = await request(server) // Use server
      .put(`/events/${testEvent.id}`)
      .set("Authorization", token)
      .send({
        title: "Updated Event",
        description: "Updated Description",
        latitude: 2,
        longitude: 2,
        dateTime: new Date().toISOString(),
        categories: "updated",
      });
    expect(response.statusCode).toBe(200);
  });

  it("should delete an event", async () => {
    const response = await request(server) // Use server
      .delete(`/events/${testEvent.id}`)
      .set("Authorization", token);
    expect(response.statusCode).toBe(200);
  });
});
