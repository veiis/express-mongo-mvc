const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { messages } = require("../utils");
const { Manager, User, Moderator, Permission } = require("./../models");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Check User Token
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

// Check Manager Token
exports.managerAuth = async (req, res, next) => {
  try {
    const bearer = req.headers["authorization"];
    const token = bearer && bearer.split(" ")[1];

    if (!token) return next(createError.Forbidden(messages.NOT_AUTHENTICATED));

    const decoded = await verify(token, ACCESS_TOKEN_SECRET);
    const manager = await Manager.findById(decoded.aud)
      .select("_id email role")
      .populate({
        path: "role",
        select: " name permissions",
        populate: { path: "permissions", select: "resource type name" },
      });

    if (!manager)
      return next(createError.Forbidden(messages.NOT_AUTHENTICATED));

    req.user = { id, email, role } = manager;

    next();
  } catch (err) {
    next(err);
  }
};

// Helper for verfiy token
const verify = (token) =>
  new Promise((resolve, reject) => {
    // Verifying JWT Token
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        // If there was an error on verifying token reject with 401
        const message =
          err.name === "TokenExpiredError" ? "Unauthorized" : err.message;
        return reject(createError.Unauthorized(message));
      }
      resolve(payload);
    });
  });

// Access Handler (check for permissions)
exports.hasAccess = (resource, access) => async (req, res, next) => {
  try {
    const { email, role } = req.user;

    // Check for superadmin (if it was superadmin call next [no need to check permissions])
    if (email === process.env.SUPERADMIN_EMAIL || role.name === "superadmin")
      return next();

    // Check for permissions
    const permission = role.permissions.find((perm) => {
      return perm.resource === resource && perm.type === access;
    });

    if (!permission)
      return next(createError.Forbidden(messages.PERMISSIN_DENIED));

    next();
  } catch (err) {
    next(err);
  }
};
