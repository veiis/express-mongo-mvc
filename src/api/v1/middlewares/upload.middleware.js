const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createHttpError = require("http-errors");

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
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif)$/)) {
    return cb(
      createHttpError.UnsupportedMediaType(
        "Only images are allowed. [jpg|JPG|jpeg|JPEG|png|PNG|gif]"
      ),
      false
    );
  }
  cb(null, true);
};

// 10mb | From Config file?
const limits = {
  fieldNameSize: 300,
  fileSize: 10 * 1024 * 1024,
};

const upload = (dir) => multer({ storage: storage(dir), fileFilter, limits });

exports.avatarUploader = upload("avatar");
