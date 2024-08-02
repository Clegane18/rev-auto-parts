const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const {
  uploadProductPhotoValidation,
  unpublishedItemByIdValidation,
  republishedItemByIdValidation,
  getProductByIdAndPublishValidation,
} = require("../middlewares/validators");
const onlineStoreFrontController = require("../controllers/onlineStoreFrontController");
const upload = require("../middlewares/multerConfig");

router.post(
  "/uploadPhoto/:productId",
  upload.single("file"),
  uploadProductPhotoValidation,
  onlineStoreFrontController.uploadProductImage
);

router.post(
  "/products/getProductByIdAndPublish/:productId",
  getProductByIdAndPublishValidation,
  onlineStoreFrontController.getProductByIdAndPublish
);

router.get(
  "/products/publishedItems/",
  onlineStoreFrontController.getPublishedItemsByCategory
);

router.post(
  "/products/unpublishedItem/:productId",
  unpublishedItemByIdValidation,
  onlineStoreFrontController.unpublishItemByProductId
);

router.use(errorHandler);
module.exports = router;
