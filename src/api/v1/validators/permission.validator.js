const Joi = require("joi");

exports.create = {
  body: Joi.object({
    name: Joi.string().required(),
    resource: Joi.string().required(),
    w: Joi.boolean().default(false),
    e: Joi.boolean().default(false),
    r: Joi.boolean().default(false),
    d: Joi.boolean().default(false),
  }),
};

exports.edit = {
  body: Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string(),
    resource: Joi.string(),
    w: Joi.boolean(),
    e: Joi.boolean(),
    r: Joi.boolean(),
    d: Joi.boolean(),
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
