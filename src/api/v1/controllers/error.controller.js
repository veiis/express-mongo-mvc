const createError = require("http-errors");
const multer = require("multer");
const { isDev, messages, logger } = require("../utils");

const whiteList = ["status", "message", "error", "fields"];

exports.handle404 = async (req, next) => {
  return next(
    createError.NotFound(
      `Route [ ${req.method} ${req.originalUrl} ] Not found.`
    )
  );
};

exports.handleError = async (err, res) => {
  const keys = Object.keys(err);
  const error = {
    status: err.status || 500,
    message: isDev() ? err.message : messages.INTERNAL_SERVER_ERROR,
  };

  if (err instanceof multer.MulterError) {
    error.status = 413;
    error.message = err.message;
  }

  for (key of keys) {
    if (whiteList.includes(key)) error[key] = err[key];
  }

  if (error.status === 500) logger.error(`${error.status} ${err.message}`);
  return res.status(error.status).json(error);
};
