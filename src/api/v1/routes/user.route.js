const express = require("express");
const router = express.Router();
const { validator, authenticate } = require("../middlewares");
const { authController } = require("../controllers");
const { authValidator } = require("../validators");

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

// Logout
router.delete(
  "/logout",
  validator(authValidator.logout),
  authController.logout
);

// Get Profile
router.get("/me", authenticate.userAuth, authController.me);

module.exports = router;
