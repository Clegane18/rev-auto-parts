const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const { uploadProductPhotoValidation } = require("../middlewares/validators");
const onlineStoreFrontController = require("../controllers/onlineStoreFrontController");
const upload = require("../middlewares/multerConfig");

router.post(
  "/uploadPhoto/:productId",
  upload.single("file"),
  uploadProductPhotoValidation,
  onlineStoreFrontController.uploadProductImage
);

router.use(errorHandler);
module.exports = router;
