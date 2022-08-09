const argon2 = require("argon2");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ManagerSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "role",
    },
    password: { type: String, required: true, select: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ManagerSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const password = this.password;
    const hashedPassword = await argon2.hash(password);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

ManagerSchema.methods.isPasswordValid = async function (password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("manager", ManagerSchema);
