const createError = require("http-errors");
const { User } = require("../models");
const { generalResponse, messages } = require("../utils");

// Admin Related
exports.create = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existUser = await User.findOne({
      email,
      deletedAt: null,
    }).lean();

    if (existUser)
      return next(createError.UnprocessableEntity(messages.DUPLICATE_USER));

    const user = await new User({ email, password }).save();

    const item = await user.getPublicFields();
    return generalResponse(res, 201, { item }, messages.REGISTER_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { id, email, password } = req.body;

    const user = await User.findOne({ _id: id, deletedAt: null });

    if (!user) {
      throw createError.NotFound({ message: messages.NOT_FOUND_DATA, id });
    }

    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    const item = await user.getPublicFields();

    return generalResponse(res, 200, { item }, messages.UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await User.findOneAndUpdate(
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

    const item = await User.findOne({ _id: id, deletedAt: null });

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

    const total = await User.countDocuments(query);
    const items = await User.find(query)
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

// User Related
exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;

    const item = await User.findOne({ _id: id, deletedAt: null }, "email id");

    return generalResponse(res, 200, { item }, messages.UPDATE_SUCCESS);
  } catch (err) {
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { email } = req.body;

    const user = await User.findOne({ _id: id, deletedAt: null }, "email id");

    if (!user) {
      throw createError.NotFound({ message: messages.NOT_FOUND_DATA, id });
    }

    const update = {};

    if (email) update.email = email;

    const item = await User.findOneAndUpdate(
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
