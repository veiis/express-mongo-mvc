const express = require("express");
const { validator } = require("../middlewares");
const { authController, permissionController } = require("../controllers");
const { authValidator, permissionValidator } = require("../validators");
const { isManager, managerAuth } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post(
  "/login",
  validator(authValidator.managerLogin),
  authController.managerLogin
);

router.use(managerAuth);
router.use(isManager);

// Permission
router
  .route("/permissions")
  .post(validator(permissionValidator.create), permissionController.create)
  .put(validator(permissionValidator.edit), permissionController.edit)
  .get(validator(permissionValidator.getAll), permissionController.getAll);

router
  .route("/permissions/:id")
  .get(validator(permissionValidator.getOne), permissionController.getOne)
  .delete(validator(permissionValidator.delete), permissionController.delete);

module.exports = router;
