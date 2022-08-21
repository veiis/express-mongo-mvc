const Joi = require("joi");

exports.create = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .message(
        "Password must include letters (lowercase and uppercase), numbers and symbols"
      )
      .required(),
    role: Joi.string().hex().length(24).required(),
  }),
};

exports.edit = {
  body: Joi.object({
    id: Joi.string().hex().length(24).required(),
    email: Joi.string().email().lowercase(),
    password: Joi.string()
      .min(8)
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .message(
        "Password must include letters (lowercase and uppercase), numbers and symbols"
      ),
    role: Joi.string().hex().length(24),
  }),
};

exports.delete = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

exports.getOne = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

exports.getAll = {
  query: Joi.object({
    page: Joi.number().default(1).min(1),
    limit: Joi.number().default(10).min(1),
    order: Joi.number().default("asc").valid("asc", "desc"),
    sort: Joi.string().default("createdAt"),
    search: Joi.string().allow(null, ""),
  }),
};
