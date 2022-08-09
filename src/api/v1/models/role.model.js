const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    permissions: [mongoose.Types.ObjectId],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("role", RoleSchema);
