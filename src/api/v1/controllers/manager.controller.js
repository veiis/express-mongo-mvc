const createError = require("http-errors");
const { Manager, Role } = require("../models");
const { generalResponse, messages } = require("../utils");
const { jwt } = require("../utils");
const redisClient = require("../helpers/redis").client;

// Admin Related CRUDs
exports.create = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const existManager = await Manager.findOne({
      email,
      deletedAt: null,
    }).lean();

    // if (existManager)
    //   return next(createError.UnprocessableEntity(messages.DUPLICATE_USER));

    const currentRole = await Role.findOne({ _id: role, deletedAt: null });
    if (!currentRole)
      return next(createError.NotFound(messages.NOT_FOUND_DATA));

    const manager = await new Manager({ email, password, role }).save();

    const item = await manager.getPublicFields();
    return generalResponse(res, 201, { item }, messages.REGISTER_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { id, email, password, role } = req.body;

    const manager = await Manager.findOne({ _id: id, deletedAt: null });

    if (!manager) {
      throw createError.NotFound({ message: messages.NOT_FOUND_DATA, id });
    }

    const currentRole = await Role.findOne({ _id: role, deletedAt: null });

    if (!currentRole) {
      throw createError.NotFound({
        message: messages.NOT_FOUND_DATA + ` ${Object.keys({ role })[0]}`,
        role,
      });
    }

    if (email) manager.email = email;
    if (password) manager.password = password;
    if (role) manager.role = role;

    await manager.save();

    const item = await manager.getPublicFields();

    return generalResponse(res, 200, { item }, messages.UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Manager.findOneAndUpdate(
      { _id: id, deletedAt: null },
      {
        deletedAt: Date.now(),
      }
    );

    if (!item) {
      throw createError.NotFound({ message: messages.NOT_FOUND_DATA, id });
    }

    return generalResponse(res, 200, {}, messages.DELETE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Manager.findOne({ _id: id, deletedAt: null }).populate(
      "role",
      "name"
    );

    if (!item) {
      throw createError.NotFound({ message: messages.NOT_FOUND_DATA, id });
    }

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
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await Manager.countDocuments(query);
    const items = await Manager.find(query)
      .populate("role", "name")
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

exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;

    const item = await Manager.findOne(
      { _id: id, deletedAt: null },
      "email id"
    );

    return generalResponse(res, 200, { item }, messages.UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    const { id, email } = req.body;

    const manager = await Manager.findOne(
      { _id: id, deletedAt: null },
      "email id"
    );

    if (!manager) {
      throw createError.NotFound({ message: messages.NOT_FOUND_DATA, id });
    }

    const update = {};

    if (email) update.email = email;

    const item = await Manager.findOneAndUpdate(
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
