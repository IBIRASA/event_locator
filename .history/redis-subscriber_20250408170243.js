const redis = require("redis");

// 1. Create a Redis Client:
const client = redis.createClient();

client.subscribe("event-notifications", (err, count) => {
  if (err) {
    console.error("Subscription error:", err);
  } else {
    console.log(
      `Subscribed to channel: event-notifications. Total subscriptions: ${count}`
    );
  }
});

client.on("message", (channel, message) => {
  console.log(`Received message on channel ${channel}: ${message}`);
});

// 4. Handle Redis client errors:
client.on("error", (err) => {
  console.error("Redis client error:", err);
});

//Optional: handle redis connection close.
client.on("end", () => {
  console.log("Redis client disconnected.");
});
