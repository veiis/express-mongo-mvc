const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const redisClient = require("./../helpers/redis").client;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const options = {
      expiresIn: "1d", // Should be 1h or 15m
      issuer: "moveisbox.io",
      audience: user.id,
    };

    jwt.sign(payload, ACCESS_TOKEN_SECRET, options, (err, token) => {
      if (err) return reject(createError.InternalServerError(err.message));
      resolve(token);
    });
  });
};

exports.signRefreshToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const options = {
      expiresIn: "1y",
      issuer: "moveisbox.io",
      audience: user.id,
    };
    jwt.sign(payload, REFRESH_TOKEN_SECRET, options, async (err, token) => {
      if (err) return reject(createError.InternalServerError(err.message));
      try {
        await redisClient.SET(user.id, token, { EX: 365 * 24 * 60 * 60 });
      } catch (err) {
        return reject(createError.InternalServerError(`REDIS: ${err.message}`));
      }
      resolve(token);
    });
  });
};

exports.verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      try {
        const result = await redisClient.GET(payload.aud);
        if (result === refreshToken) return resolve(payload.aud);
        else return reject(createError.Unauthorized());
      } catch (err) {
        return reject(createError.InternalServerError(`REDIS: ${err.message}`));
      }
    });
  });
};
