const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const { uploadProductPhotosValidation } = require("../middlewares/validators");
const onlineStoreFrontController = require("../controllers/onlineStoreFrontController");
const upload = require("../middlewares/multerConfig");

router.post(
  "/uploadPhotos/:productId",
  upload.array("productPhotos", 5), // Middleware to handle file upload (limit to 5 files)
  uploadProductPhotosValidation, // Validation middleware
  onlineStoreFrontController.uploadProductPhotos // Controller to handle the uploaded photos
);

router.use(errorHandler);
module.exports = router;
