const Joi = require("joi");
const { role } = require("../utils/constants");

exports.create = {
  body: Joi.object({
    name: Joi.string().valid(role.MODERATOR).required(),
    description: Joi.string(),
    permissions: Joi.array().items(Joi.string().hex().length(24)),
  }),
};

exports.edit = {
  body: Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().valid(role.MODERATOR),
    description: Joi.string(),
    permissions: Joi.array().items(Joi.string().hex().length(24)),
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
