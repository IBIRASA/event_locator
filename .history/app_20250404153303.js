const express = require("express");
const app = express();
const usersRouter = require("./routes/users");
const eventsRouter = require("./routes/events");
const ratingsRouter = require("./routes/ratings");
const favoritesRouter = require("./routes/favorites");
const { client } = require("./utils/redis");
const { getEvents } = require("./models/event");
const i18next = require("./utils/i18n");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.json());

app.use((req, res, next) => {
  console.log("i18next initialized:", i18next.isInitialized);
  console.log(
    "req.headers['accept-language']:",
    req.headers["accept-language"]
  );
  console.log("req.query.lang:", req.query.lang);

  let lang = req.headers["accept-language"] || req.query.lang || "en";
  if (!["en", "fr"].includes(lang)) {
    lang = "en";
  }
  i18next.changeLanguage(lang);

  console.log("i18next language:", i18next.language);

  // Explicitly set req.i18n
  req.i18n = i18next;

  console.log("req.i18n", req.i18n);

  next();
});

// Middleware for token verification
// function verifyToken(req, res, next) {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(403).send({ message: i18next.t("noToken") });

//   jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//     if (err)
//       return res.status(401).send({ message: i18next.t("invalidToken") });
//     req.user = decoded;
//     next();
//   });
// }
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  console.log('Authorization Header:', authHeader);
  if (!token) return res.status(403).send({ message: i18next.t("noToken") });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY); //split to remove bearer
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err); //log error
    return res.status(401).send({ message: i18next.t("invalidToken") });
  }
}
app.use("/users", usersRouter);
app.use("/events", verifyToken, eventsRouter); // Protect event routes
app.use("/ratings", verifyToken, ratingsRouter); // Protect rating routes
app.use("/favorites", verifyToken, favoritesRouter); // Protect favorite routes

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
async function sendEventNotifications() {
  try {
    const now = new Date();
    const upcomingEvents = await getEvents(); // Add date filter to get upcoming events.
    for (const event of upcomingEvents) {
      const message = i18next.t("upcomingEvent", {
        lng: "en",
        event: event.title,
        date: event.date_time,
      });
      client.publish("event-notifications", message);
    }
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
}

// Example: Send notifications every minute (for testing).
setInterval(sendEventNotifications, 60000);
module.exports = { app, server };
