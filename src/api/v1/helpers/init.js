const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const swagger = require("swagger-ui-express");

const { logger } = require("../utils");
const { morgan } = require("./../middlewares");

const connectToMongoDB = require("./mongodb");
const connectToRedis = require("./redis").init;

const openapiDocs = require("./../../openapi.json");

module.exports = async (app) => {
  logger.warn("♻ Initializing Requirements.");
  await connectToMongoDB();
  await connectToRedis();

  app.use(morgan);
  app.use(cors());
  app.use(helmet());
  app.use("/v1/docs", swagger.serve, swagger.setup(openapiDocs));
  app.use("/api", require("./../routes"));
};
