const createError = require("http-errors");
const { isDev, messages, logger } = require("../utils");

exports.handle404 = async (req, next) => {
  return next(
    createError.NotFound(
      `Route [ ${req.method} ${req.originalUrl} ] Not found.`
    )
  );
};

exports.handleError = async (err, res) => {
  logger.error(err);
  const keys = Object.keys(err);
  const error = {
    status: err.status || 500,
    message: isDev() ? err.message : messages.INTERNAL_SERVER_ERROR,
  };

  for (key of keys) {
    error[key] = err[key];
  }

  if (error.status === 500) logger.error(`${error.status} ${err.message}`);
  return res.status(error.status).json(error);
};
