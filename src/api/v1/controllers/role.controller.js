const createError = require("http-errors");
const { Role } = require("../models");
const { generalResponse, messages } = require("../utils");

exports.create = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;

    // Permissions?
    const existItem = await Role.findOne({ name, deletedAt: null }).lean();

    if (existItem)
      return next(
        createError.UnprocessableEntity({
          message: messages.DUPLICATE_DATA,
          name,
        })
      );

    // Check for Permissions []

    const item = await new Role({ name, description, permissions }).save();

    return generalResponse(res, 201, { item }, messages.CREATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { id, name, description, permissions } = req.body;

    const existItem = await Role.findOne({
      name,
      _id: { $ne: id },
      deletedAt: null,
    }).lean();

    if (existItem)
      return next(
        createError.UnprocessableEntity({
          msg: messages.DUPLICATE_DATA,
          name,
        })
      );

    const update = {};
    if (name) update.name = name;
    if (permissions) update.permissions = permissions;
    if (description) update.resource = resource;

    const item = await Role.findOneAndUpdate(
      { _id: id, deletedAt: null },
      update,
      { new: true }
    );

    if (!item) return next(createError.NotFound(messages.NOT_FOUND_DATA));

    return generalResponse(res, 200, { item }, messages.UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Role.findOneAndUpdate(
      { _id: id, deletedAt: null },
      {
        deletedAt: Date.now(),
      }
    );

    if (!item) return next(createError.NotFound(messages.NOT_FOUND_DATA));

    return generalResponse(res, 200, {}, messages.DELETE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Role.findOne({ _id: id, deletedAt: null });

    return generalResponse(res, 200, { item }, messages.READ_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, order, sort, search } = req.query;
    const query = {
      deletedAt: null,
    };

    if (search) {
      query["$or"] = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Role.countDocuments(query);
    const items = await Role.find(query)
      .select("-__v")
      .sort({ [sort]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return generalResponse(
      res,
      200,
      { items, total, page, limit },
      messages.READ_SUCCESS
    );
  } catch (err) {
    next(err);
  }
};
