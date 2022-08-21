const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { RESOURCE, ACCESS } = require("../data");

const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      default: null,
    },
    resource: {
      type: String,
      lowercase: true,
      trim: true,
      enum: Object.values(RESOURCE),
    },
    type: {
      type: String,
      lowercase: true,
      trim: true,
      enum: Object.values(ACCESS),
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("permission", PermissionSchema);
