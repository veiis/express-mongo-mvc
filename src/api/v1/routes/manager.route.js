const express = require("express");
const { isManager } = require("../middlewares/auth.middleware");
const router = express.Router();

router.use(isManager);

module.exports = router;
