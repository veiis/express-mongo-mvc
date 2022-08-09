const express = require("express");
const { errorController } = require("../controllers");
const router = express.Router();

router.use("/user", require("./user.route"));
router.use("/manager", require("./manager.route"));
router.use("/public", require("./public.route"));

// Handle errors and 404
router.use("*", async (req, res, next) => errorController.handle404(req, next));
router.use((err, req, res, next) => errorController.handleError(err, res));

module.exports = router;
