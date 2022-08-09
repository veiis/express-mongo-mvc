const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { messages } = require("../utils");
const { User } = require("./../models");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.userAuth = async (req, res, next) => {
  try {
    const bearer = req.headers["authorization"];
    const token = bearer && bearer.split(" ")[1];

    if (!token) return next(createError.Forbidden(messages.NOT_AUTHENTICATED));

    const decoded = await verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.aud).select("_id email");

    if (!user) return next(createError.Forbidden(messages.NOT_AUTHENTICATED));

    req.user = { id: user.id, email: user.email };

    next();
  } catch (err) {
    next(err);
  }
};

exports.managerAuth = async (req, res, next) => {
  try {
    const bearer = req.headers["authorization"];
    const token = bearer && bearer.split(" ")[1];

    if (!token) return next(createError.Forbidden(messages.NOT_AUTHENTICATED));

    const decoded = await verify(token, ACCESS_TOKEN_SECRET);
    const manager = await Manager.findById(decoded.aud).select("_id email");
    if (!manager)
      return next(createError.Forbidden(messages.NOT_AUTHENTICATED));

    req.user = { id: manager.id, email: manager.email };
    next();
  } catch (err) {
    next(err);
  }
};

const verify = (token, secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return reject(createError.Unauthorized(message));
      }
      resolve(payload);
    });
  });
