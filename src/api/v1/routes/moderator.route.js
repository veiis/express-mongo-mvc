const express = require("express");
const { authController } = require("../controllers");
const { authValidator } = require("../validators");
const {
  moderatorAuth,
  isModerator,
  hasAccess,
} = require("../middlewares/auth.middleware");
const { validator } = require("../middlewares");
const { accessKeys } = require("../utils/constants");
const router = express.Router();

router.post(
  "/login",
  validator(authValidator.moderatorLogin),
  authController.moderatorLogin
);

router.use(moderatorAuth);
router.use(isModerator);

// Moderator
router.get(
  "/test-permission",
  hasAccess("post", accessKeys.write),
  (req, res, next) => res.json({ success: "true" })
);

module.exports = router;
