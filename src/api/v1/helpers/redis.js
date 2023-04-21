const redis = require("redis");
const { logger } = require("../utils");
const { REDIS_PORT, REDIS_HOST, REDIS_USER, REDIS_PASS, REDIS_USE_AUTH } = process.env;


const options = { url: `redis://${REDIS_HOST}:${REDIS_PORT}` }

if (REDIS_USE_AUTH === "true" || REDIS_USE_AUTH === "1") {
  options.username = REDIS_USER
  options.password = REDIS_PASS
}

const client = redis.createClient(options)

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

client.on("error", (err) => {
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
