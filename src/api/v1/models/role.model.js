const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { RL } = require("../data");

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
    },
    permissions: [{ type: mongoose.Types.ObjectId, ref: "permission" }],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("role", RoleSchema);
