const redis = require("redis");

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

client.on("error", (err) => {
  console.error("Redis client error:", err);
});

client.on("end", () => {
  console.log("Redis client disconnected.");
});
