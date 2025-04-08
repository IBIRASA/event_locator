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

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader); // Log header

  if (!authHeader) {
    console.error("Authorization Header Missing");
    return res.status(401).send({ message: i18next.t("invalidToken") });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    console.error("Invalid Authorization Header Format");
    return res.status(401).send({ message: i18next.t("invalidToken") });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(401).send({ message: i18next.t("invalidToken") });
  }
}
app.use("/users", usersRouter);
app.use("/events", verifyToken, eventsRouter); 
app.use("/ratings", verifyToken, ratingsRouter); 
app.use("/favorites", verifyToken, favoritesRouter); 

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
    const upcomingEvents = await getEvents(); 
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


setInterval(sendEventNotifications, 60000);
module.exports = { app, server };
