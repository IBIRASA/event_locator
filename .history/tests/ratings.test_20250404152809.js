// const request = require("supertest");
// const { app, server } = require("../app");
// const pool = require("../utils/database");
// // const { createRating } = require('../models/rating');
// // const { generateToken } = require('../models/user');
// const { createUser, generateToken } = require("../models/user");
// describe("Rating Routes", () => {
//   let testUser;
//   let testEvent;
//   let token;

//   beforeAll(async () => {
//     testUser = await pool.query(
//       "INSERT INTO users (username, password_hash) VALUES ('ratingUser', 'hash') RETURNING *"
//     );
//     testUser = testUser.rows[0];
//     testEvent = await pool.query(
//       "INSERT INTO events (title, description, latitude, longitude, date_time, categories, user_id) VALUES ('Rating Test', 'desc', 0, 0, NOW(), 'test', $1) RETURNING *",
//       [testUser.id]
//     );
//     testEvent = testEvent.rows[0];
//     token = generateToken(testUser);
//   });

//   afterAll(async () => {
//     await pool.query("DELETE FROM ratings WHERE event_id = $1", [testEvent.id]);
//     await pool.query("DELETE FROM events WHERE id = $1", [testEvent.id]);
//     await pool.query("DELETE FROM users WHERE id = $1", [testUser.id]);
//     await pool.end();
//   });

//   it("should create a new rating", async () => {
//     const response = await request(app)
//       .post("/ratings")
//       .set("Authorization", token)
//       .send({
//         eventId: testEvent.id,
//         userId: testUser.id,
//         rating: 4,
//         comment: "Okay",
//       });
//     expect(response.statusCode).toBe(201);
//   });

//   it("should get ratings by event ID", async () => {
//     const response = await request(app)
//       .get(`/ratings/${testEvent.id}`)
//       .set("Authorization", token);
//     expect(response.statusCode).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });
// });
// tests/ratings.test.js
const request = require('supertest');
const { app, server } = require('../app'); // Import app and server
const { createUser, generateToken } = require('../models/user');
const pool = require('../utils/database');

describe('Rating Routes', () => {
    let token;
    let testUser;
    let testEvent;

    beforeAll(async () => {
        // Setup test data
        testUser = await createUser('testuser', 'password', 0, 0, 'test', 'en');
        token = 'Bearer ' + generateToken(testUser);

        const eventResult = await pool.query(
            'INSERT INTO events (title, description, latitude, longitude, date_time, categories, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            ['Test Event', 'Test Description', 0, 0, new Date(), 'Test', testUser.id]
        );
        testEvent = eventResult.rows[0];
    });

    afterAll(async () => {
        // Clean up test data
        await pool.query('DELETE FROM ratings WHERE event_id = $1', [testEvent.id]);
        await pool.query('DELETE FROM events WHERE id = $1', [testEvent.id]);
        await pool.query('DELETE FROM users WHERE id = $1', [testUser.id]);
        server.close(); //close the server after the tests finish.
    });

    it('should create a new rating', async () => {
        const response = await request(app)
            .post('/ratings')
            .set('Authorization', token)
            .send({
                eventId: testEvent.id,
                rating: 5,
            });
        expect(response.statusCode).toBe(201);
    });

    it('should get ratings by event ID', async () => {
        const response = await request(app)
            .get(`/ratings/${testEvent.id}`)
            .set('Authorization', token);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});