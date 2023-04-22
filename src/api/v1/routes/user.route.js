const express = require("express");
const router = express.Router();
const { validator, authenticate } = require("../middlewares");
const { authController } = require("../controllers");
const { authValidator } = require("../validators");
const { userAuth } = require("../middlewares/auth.middleware");

// Register
router.post(
  "/register",
  validator(authValidator.register),
  authController.register
);

// Login
router.post("/login", validator(authValidator.login), authController.login);

// Refresh Token
router.post(
  "/refresh-token",
  validator(authValidator.refreshToken),
  authController.refreshToken
);

router.use(userAuth);

// Logout
router.delete(
  "/logout",
  validator(authValidator.logout),
  authController.logout
);

// Get Profile
router.get("/me", authController.getProfileUser);

// Reset Password
router.post(
  "/reset-password",
  validator(authValidator.resetPassword),
  authController.resetPasswordUser
);

module.exports = router;
