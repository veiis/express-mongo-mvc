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
