const multer = require("multer");
const path = require("path");
const fs = require("fs");

const showcaseUploadsDir = path.join(process.cwd(), "uploads", "showcase");

if (!fs.existsSync(showcaseUploadsDir)) {
  fs.mkdirSync(showcaseUploadsDir, { recursive: true });
}

const showcaseStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, showcaseUploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `showcase-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const showcaseFileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images are allowed for showcase!"));
};

const showcaseUpload = multer({
  storage: showcaseStorage,
  fileFilter: showcaseFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = showcaseUpload;
