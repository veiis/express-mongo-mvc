const Joi = require("joi");

exports.create = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    permissions: Joi.array()
      .min(1)
      .items(Joi.string().hex().length(24))
      .required(),
  }),
};

exports.edit = {
  body: Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string(),
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
