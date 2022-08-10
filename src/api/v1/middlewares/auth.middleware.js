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
      .populate("role", "name");

    if (!manager)
      return next(createError.Forbidden(messages.NOT_AUTHENTICATED));

    req.user = { id, email, role } = manager;
    next();
  } catch (err) {
    next(err);
  }
};

// Check Moderator Token
exports.moderatorAuth = async (req, res, next) => {
  try {
    const bearer = req.headers["authorization"];
    const token = bearer && bearer.split(" ")[1];

    if (!token) return next(createError.Forbidden(messages.NOT_AUTHENTICATED));

    const decoded = await verify(token, ACCESS_TOKEN_SECRET);
    const moderator = await Moderator.findById(decoded.aud)
      .select("_id email role")
      .populate({
        path: "role",
        select: "name permissions",
        populate: {
          path: "permissions",
          select: "name resource write edit read delete",
        },
      });

    if (!moderator)
      return next(createError.Forbidden(messages.NOT_AUTHENTICATED));

    req.user = {
      id: moderator.id,
      email: moderator.email,
      role: moderator.role,
    };

    next();
  } catch (err) {
    next(err);
  }
};

// Helper for verfiy token
const verify = (token) =>
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

// Role Checker [moderator, manager]
exports.isModerator = (req, res, next) => {
  try {
    const role = req.user.role;
    if (role.name === "moderator" || role.name === "manager") return next();
    return next(createError.Forbidden(messages.PERMISSIN_DENIED));
  } catch (err) {
    next(err);
  }
};

// Role Checker [manager]
exports.isManager = async (req, res, next) => {
  try {
    const { email, role } = req.user;
    if (role.name === "manager" && email === process.env.MANAGER_EMAIL)
      return next();
    return next(createError.Forbidden(messages.PERMISSIN_DENIED));
  } catch (err) {
    next(err);
  }
};

// Permission Handler
exports.hasAccess = (resource, access) => async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role.name.toLowerCase() === "manager") return next();

    const permission = role.permissions.find(
      (perm) => perm.resource === resource && perm[access]
    );

    if (!permission)
      return next(createError.Forbidden(messages.PERMISSIN_DENIED));

    next();
  } catch (err) {
    next(err);
  }
};
