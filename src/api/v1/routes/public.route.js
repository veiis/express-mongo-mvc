const express = require("express");
const { avatarUploader } = require("../middlewares/upload.middleware");
const router = express.Router();

router.post("/test", avatarUploader.single("image"), (req, res, next) => {
  console.log(req.file);
  res.json({ success: "true" });
});

module.exports = router;
