const http = require("http");
const express = require("express");
const path = require("path")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3003;

const { init } = require("./api/v1/helpers");
const { logger } = require("./api/v1/utils");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public", "files")));

const startServer = async () => {
  await init(app);
  http
    .createServer(app)
    .listen(PORT, () => console.log(`✅ Server is running on http://localhost:${PORT}\n🐈 Swagger Documentation http://localhost:${PORT}/v1/docs`));
};

startServer();
