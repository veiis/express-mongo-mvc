const mongoose = require("mongoose");
const { logger, isDev } = require("../utils");

const { MONGO_SERVER, MONGO_DATABASE_NAME, MONGO_USER, MONGO_PASS, MONGO_USE_AUTH } =
  process.env;

module.exports = async () => {
  try {
    console.log(" > Initializing MongoDB.");
    const options = {
      dbName: MONGO_DATABASE_NAME,
    }

    if (MONGO_USE_AUTH === "true" || MONGO_USE_AUTH === "1") {
      options.user = MONGO_USER
      options.pass = MONGO_PASS
    }

    await mongoose.connect(`mongodb://${MONGO_SERVER}`, options);

    // mongoose.set("debug", isDev());
  } catch (err) {
    logger.error(`⛔ Failed to connect to MongoDB, ${err.message}`);
    logger.error("🛑 Exiting ...");
    process.exit(0);
  }
};

mongoose.connection.on("connected", () =>
  console.log("✅ Database (MongoDB) Connected.")
);

mongoose.connection.on("err", (err) =>
  logger.error(`⛔ Failed to connect to MongoDB, ${err.message}`)
);

mongoose.connection.on("disconnected", () =>
  console.log("❌ MongoDB Disconnected")
);

// Events on CTRL+C (exit)
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
