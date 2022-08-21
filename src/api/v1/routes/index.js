const express = require("express");
const router = express.Router();

router.use("/user", require("./user.route"));
router.use("/manager", require("./manager.route"));
router.use("/public", require("./public.route"));

module.exports = router;
