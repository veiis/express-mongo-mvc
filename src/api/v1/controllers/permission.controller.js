const createError = require("http-errors");
const { Permission } = require("../models");
const { generalResponse, messages } = require("../utils");

exports.create = async (req, res, next) => {
  try {
    const { name, resource, w, r, e, d } = req.body;

    const existItem = await Permission.findOne({
      name,
      resource,
      deletedAt: null,
    }).lean();

    if (existItem)
      return next(
        createError.UnprocessableEntity({
          message: messages.DUPLICATE_DATA,
          name,
          resource,
        })
      );

    const item = await new Permission({ name, resource, w, r, e, d }).save();

    return generalResponse(res, 201, { item }, messages.CREATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { id, name, resource, w, r, e, d } = req.body;

    const existItem = await Permission.findOne({
      name,
      resource,
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
    if (resource) update.resource = resource;
    if (typeof w === "boolean") update.w = w;
    if (typeof r === "boolean") update.r = r;
    if (typeof e === "boolean") update.e = e;
    if (typeof d === "boolean") update.d = d;

    const item = await Permission.findOneAndUpdate(
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

    const item = await Permission.findOneAndUpdate(
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

    const item = await Permission.findOne({ _id: id, deletedAt: null });

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
          resource: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Permission.countDocuments(query);
    const items = await Permission.find(query)
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
