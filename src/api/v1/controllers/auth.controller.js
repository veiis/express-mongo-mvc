const createError = require("http-errors");
const { User, Moderator, Manager } = require("../models");
const { generalResponse, messages } = require("../utils");
const { jwt } = require("../utils");
const redisClient = require("../helpers/redis").client;

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existUser = await User.findOne({ email, deletedAt: null }).lean();
    if (existUser)
      return next(createError.UnprocessableEntity(messages.DUPLICATE_USER));

    const user = await new User({ email, password }).save();

    const accessToken = await jwt.signAccessToken(user);
    const refreshToken = await jwt.signRefreshToken(user);

    return generalResponse(
      res,
      201,
      { accessToken, refreshToken },
      messages.REGISTER_SUCCESS
    );
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }, "password email id");

    if (!user) {
      throw createError.Unauthorized(messages.EMAIL_OR_PASSWORD_INCORRECT);
    }

    const isMatch = await user.isPasswordValid(password);
    if (!isMatch) {
      throw createError.Unauthorized(messages.EMAIL_OR_PASSWORD_INCORRECT);
    }

    const accessToken = await jwt.signAccessToken(user);
    const refreshToken = await jwt.signRefreshToken(user);

    return generalResponse(
      res,
      202,
      { accessToken, refreshToken },
      messages.LOGIN_SUCCESS
    );
  } catch (err) {
    next(err);
  }
};

exports.managerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const manager = await Manager.findOne({ email }, "password email id");

    if (!manager) {
      throw createError.Unauthorized(messages.EMAIL_OR_PASSWORD_INCORRECT);
    }

    const isMatch = await manager.isPasswordValid(password);
    if (!isMatch) {
      throw createError.Unauthorized(messages.EMAIL_OR_PASSWORD_INCORRECT);
    }

    const accessToken = await jwt.signAccessToken(manager);
    const refreshToken = await jwt.signRefreshToken(manager);

    return generalResponse(
      res,
      202,
      { accessToken, refreshToken },
      messages.LOGIN_SUCCESS
    );
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const userId = await jwt.verifyRefreshToken(refreshToken);

    const accessToken = await jwt.signAccessToken({ id: userId });
    const newRefreshToken = await jwt.signRefreshToken({ id: userId });

    return generalResponse(
      res,
      202,
      { accessToken, refreshToken: newRefreshToken },
      messages.TOKEN_GENERATED
    );
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = await jwt.verifyRefreshToken(refreshToken);
    await redisClient.DEL(userId);
    return generalResponse(res, 204);
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).lean();

    return generalResponse(res, 201, { user }, messages.SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.resetPasswordUser = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, repeatNewPassword } = req.body;

    if (newPassword !== repeatNewPassword)
      throw createError.Conflict({
        message: messages.PASSWORDS_DOES_NOT_MATCH,
        newPassword,
        repeatNewPassword,
      });

    const { id } = req.user;
    const user = await User.findById(id, "password");

    const isMatch = await user.isPasswordValid(oldPassword);
    if (!isMatch) {
      throw createError.Unauthorized(messages.INCORRECT_PASSWORD);
    }

    user.password = newPassword;
    await user.save();

    return generalResponse(res, 200, {}, messages.UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.resetPasswordManager = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, repeatNewPassword } = req.body;

    if (newPassword !== repeatNewPassword)
      throw createError.Conflict({
        message: messages.PASSWORDS_DOES_NOT_MATCH,
        newPassword,
        repeatNewPassword,
      });

    const { id } = req.user;
    const manager = await Manager.findById(id, "password");

    const isMatch = await manager.isPasswordValid(oldPassword);
    if (!isMatch) {
      throw createError.Unauthorized(messages.INCORRECT_PASSWORD);
    }

    manager.password = newPassword;
    await manager.save();

    return generalResponse(res, 200, {}, messages.UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};
