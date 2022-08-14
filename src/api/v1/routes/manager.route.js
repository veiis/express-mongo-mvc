const express = require("express");
const { validator } = require("../middlewares");
const {
  authController,
  permissionController,
  roleController,
} = require("../controllers");
const {
  authValidator,
  permissionValidator,
  roleValidator,
} = require("../validators");
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

// Role
router
  .route("/roles")
  .post(validator(roleValidator.create), roleController.create)
  .put(validator(roleValidator.edit), roleController.edit)
  .get(validator(roleValidator.getAll), roleController.getAll);

router
  .route("/roles/:id")
  .get(validator(roleValidator.getOne), roleController.getOne)
  .delete(validator(roleValidator.delete), roleController.delete);

module.exports = router;
