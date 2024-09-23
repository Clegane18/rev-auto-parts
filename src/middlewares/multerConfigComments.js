const multer = require("multer");
const path = require("path");
const fs = require("fs");

const commentUploadsDir = "./uploads/commentsUpload";
if (!fs.existsSync(commentUploadsDir)) {
  fs.mkdirSync(commentUploadsDir, { recursive: true });
}

const commentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, commentUploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only images are allowed!"));
};

const commentUpload = multer({
  storage: commentStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = {
  commentUpload,
};
