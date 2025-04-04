const request = require("supertest");
const { app, server } = require("../app"); // Import app and server
const pool = require("../utils/database");
const { createUser, findUserByUsername } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("User Routes", () => {
  let testUser;

  beforeAll(async () => {
    testUser = await createUser("testuser", "password", 0, 0, "test", "en");
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE username = $1", ["testuser"]);
    await pool.end();
    server.close(); // Close the server
  });

  it("should register a new user", async () => {
    const response = await request(server) // Use server
      .post("/users/register")
      .send({
        username: "newuser",
        password: "newpassword",
        latitude: 1,
        longitude: 1,
        preferredCategories: "test",
        language: "en",
      });
    expect(response.statusCode).toBe(201);

    await pool.query("DELETE FROM users WHERE username = $1", ["newuser"]);
  });

  it("should login an existing user and return a token", async () => {
    const response = await request(server) // Use server
      .post("/users/login")
      .send({
        username: "testuser",
        password: "password",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    const decoded = jwt.verify(response.body.token, process.env.SECRET_KEY);
    expect(decoded.username).toBe("testuser");
  });

  it("should fail login with invalid credentials", async () => {
    const response = await request(server) // Use server
      .post("/users/login")
      .send({
        username: "testuser",
        password: "wrongpassword",
      });
    expect(response.statusCode).toBe(401);
  });
});
