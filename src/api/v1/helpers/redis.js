const redis = require("redis");
const { logger } = require("../utils");
const { REDIS_PORT, REDIS_HOST } = process.env;

const redisUrl = `redis://${REDIS_HOST}:${REDIS_PORT}`

const client = redis.createClient({ url: redisUrl })

module.exports = {
  init: async () => {
    try {
      console.log(" > Initializing Redis.");
      await client.connect();

      return client;
    } catch (err) {
      logger.error(`⛔ Failed to connect to Redis, ${err.message}`);
      logger.error("🛑 Exiting ...");
      process.exit(0);
    }
  },
  client,
};

client.on("connect", () => {
  console.log("✅ Redis Connected");
});

client.on("ready", () => {
  console.log("⚡ Redis is Ready");
});

client.on("error", () => {
  logger.error(`⛔ Failed to connect to Redis, ${err.message}`);
  process.exit(0);
});

client.on("end", () => {
  console.log("❌ Redis Disconnected");
  process.exit(0);
});

// Events on CTRL+C (exit)
process.on("SIGINT", async () => {
  await client.quit();
  process.exit(0);
});
