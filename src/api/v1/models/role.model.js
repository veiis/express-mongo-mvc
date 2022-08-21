const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    permissions: [
      { type: mongoose.Types.ObjectId, ref: "permission", default: [] },
    ],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("role", RoleSchema);
