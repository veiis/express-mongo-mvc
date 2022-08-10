const http = require("http");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3003;

const { init } = require("./api/v1/helpers");
const { logger } = require("./api/v1/utils");

app.use(express.json());
app.use(express.static(__dirname + "/public/files"));

const startServer = async () => {
  await init(app);
  http
    .createServer(app)
    .listen(PORT, () => logger.info(`✅ Server is running on port ${PORT}`));
};

startServer();
