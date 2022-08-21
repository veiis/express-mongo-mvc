const Joi = require("joi");

exports.register = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) // a A 0-9 #
      .message(
        "Password must include letters (lowercase and uppercase), numbers and symbols"
      )
      .required(),
  }),
};

exports.login = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) // a A 0-9 #
      .message(
        "Password must include letters (lowercase and uppercase), numbers and symbols"
      )
      .required(),
  }),
};

exports.managerLogin = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) // a A 0-9 #
      .message(
        "Password must include letters (lowercase and uppercase), numbers and symbols"
      )
      .required(),
  }),
};

exports.moderatorLogin = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) // a A 0-9 #
      .message(
        "Password must include letters (lowercase and uppercase), numbers and symbols"
      )
      .required(),
  }),
};

exports.logout = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

exports.refreshToken = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

exports.resetPassword = {
  body: Joi.object({
    oldPassword: Joi.string()
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) // a A 0-9 #
      .message(
        "Password must include letters (lowercase and uppercase), numbers and symbols"
      )
      .required(),
    newPassword: Joi.string()
      .disallow(Joi.ref("oldPassword"))
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) // a A 0-9 #
      .message(
        "Password must include letters (lowercase and uppercase), numbers and symbols"
      )
      .required()
      .messages({
        "any.invalid": "new password should be different with old password",
      }),
    repeatNewPassword: Joi.string()
      .required()
      .valid(Joi.ref("newPassword"))
      .messages({
        "any.only": "password repeat does not match with new password",
      }),
  }),
};
