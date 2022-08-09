const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    resource: String,
    w: Boolean,
    e: Boolean,
    r: Boolean,
    d: Boolean,
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("permission", PermissionSchema);
