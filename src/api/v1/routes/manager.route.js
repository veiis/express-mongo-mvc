const express = require("express");
const router = express.Router();
const { validator } = require("../middlewares");
const {
  authController,
  permissionController,
  roleController,
  managerController,
} = require("../controllers");
const {
  authValidator,
  permissionValidator,
  roleValidator,
  managerValidator,
} = require("../validators");
const { managerAuth, hasAccess } = require("../middlewares/auth.middleware");
const { ACCESS, RESOURCE } = require("../data");

router.post(
  "/login",
  validator(authValidator.managerLogin),
  authController.managerLogin
);

router.use(managerAuth);

router.get(
  "/test-permission",
  hasAccess(RESOURCE.USERS, ACCESS.WRITE),
  (req, res, next) => res.json({ success: "true" })
);

// Permission
router
  .route("/permissions")
  .post(
    hasAccess(RESOURCE.PERMISSIONS, ACCESS.WRITE),
    validator(permissionValidator.create),
    permissionController.create
  )
  .put(
    hasAccess(RESOURCE.PERMISSIONS, ACCESS.EDIT),
    validator(permissionValidator.edit),
    permissionController.edit
  )
  .get(
    hasAccess(RESOURCE.PERMISSIONS, ACCESS.READ),
    validator(permissionValidator.getAll),
    permissionController.getAll
  );

router
  .route("/permissions/:id")
  .get(
    hasAccess(RESOURCE.PERMISSIONS, ACCESS.READ),
    validator(permissionValidator.getOne),
    permissionController.getOne
  )
  .delete(
    hasAccess(RESOURCE.PERMISSIONS, ACCESS.DELETE),
    validator(permissionValidator.delete),
    permissionController.delete
  );

// Role
router
  .route("/roles")
  .post(
    hasAccess(RESOURCE.ROLES, ACCESS.WRITE),
    validator(roleValidator.create),
    roleController.create
  )
  .put(
    hasAccess(RESOURCE.ROLES, ACCESS.EDIT),
    validator(roleValidator.edit),
    roleController.edit
  )
  .get(
    hasAccess(RESOURCE.ROLES, ACCESS.READ),
    validator(roleValidator.getAll),
    roleController.getAll
  );

router
  .route("/roles/:id")
  .get(
    hasAccess(RESOURCE.ROLES, ACCESS.READ),
    validator(roleValidator.getOne),
    roleController.getOne
  )
  .delete(
    hasAccess(RESOURCE.ROLES, ACCESS.DELETE),
    validator(roleValidator.delete),
    roleController.delete
  );

// Manager
router
  .route("/managers")
  .post(
    hasAccess(RESOURCE.MANAGERS, ACCESS.WRITE),
    validator(managerValidator.create),
    managerController.create
  )
  .put(
    hasAccess(RESOURCE.MANAGERS, ACCESS.EDIT),
    validator(managerValidator.edit),
    managerController.edit
  )
  .get(
    hasAccess(RESOURCE.MANAGERS, ACCESS.READ),
    validator(managerValidator.getAll),
    managerController.getAll
  );

router
  .route("/managers/:id")
  .get(
    hasAccess(RESOURCE.MANAGERS, ACCESS.READ),
    validator(managerValidator.getOne),
    managerController.getOne
  )
  .delete(
    hasAccess(RESOURCE.MANAGERS, ACCESS.DELETE),
    validator(managerValidator.delete),
    managerController.delete
  );

module.exports = router;
