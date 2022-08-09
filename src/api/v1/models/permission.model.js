const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    resource: { type: String, lowercase: true, trim: true },
    write: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("permission", PermissionSchema);
