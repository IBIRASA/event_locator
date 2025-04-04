const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
    url: process.env.REDIS_URL,
});

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().catch(console.error);

const subscriber = client.duplicate();
subscriber.connect().catch(console.error);

module.exports = { client, subscriber };