const redis = require("redis");
const { logger } = require("../utils");
const { REDIS_PORT, REDIS_HOST } = process.env;

const client = redis.createClient({
  port: REDIS_PORT,
  host: REDIS_HOST,
});

module.exports = {
  init: async () => {
    try {
      logger.warn(" > Initializing Redis.");
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
  logger.info("✅ Redis Connected");
});

client.on("ready", () => {
  logger.info("⚡ Redis is Ready");
});

client.on("error", () => {
  logger.error(`⛔ Failed to connect to Redis, ${err.message}`);
});

client.on("end", () => {
  logger.info("❌ MongoDB Disconnected");
});

// Events on CTRL+C (exit)
process.on("SIGINT", async () => {
  await client.quit();
  process.exit(0);
});
