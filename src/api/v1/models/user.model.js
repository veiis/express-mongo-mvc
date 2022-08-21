const argon2 = require("argon2");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, select: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
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

UserSchema.methods.isPasswordValid = async function (password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (err) {
    throw err;
  }
};

UserSchema.methods.getPublicFields = async function () {
  try {
    return { id: this.id, email: this.email };
  } catch (err) {
    throw err;
  }
};

module.exports = mongoose.model("user", UserSchema);
