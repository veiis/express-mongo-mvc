const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { resources } = require("../utils/constants");

const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    resource: {
      type: String,
      lowercase: true,
      trim: true,
      enum: Object.values(resources),
    },
    w: { type: Boolean, default: false },
    r: { type: Boolean, default: false },
    e: { type: Boolean, default: false },
    d: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("permission", PermissionSchema);
