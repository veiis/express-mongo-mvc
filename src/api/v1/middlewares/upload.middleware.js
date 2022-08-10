const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = (dir) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = path.join(__dirname + `/../../../public/files/${dir}`);
      const isDirExists = fs.existsSync(folder);
      if (!isDirExists) {
        fs.mkdirSync(folder, { recursive: true });
      }

      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const filename =
        file.fieldname +
        "-" +
        dir +
        "-" +
        Date.now().toString() +
        path.extname(file.originalname);
      cb(null, filename);
    },
  });

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    return cb("Only images are allowed.", false);
  }
  cb(null, true);
};

const upload = (dir) => multer({ storage: storage(dir), fileFilter });

exports.avatarUploader = upload("avatar");
