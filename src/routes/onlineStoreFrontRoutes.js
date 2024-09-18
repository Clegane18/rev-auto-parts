const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const {
  uploadProductPhotoValidation,
  unpublishedItemByIdValidation,
  getProductByIdAndPublishValidation,
  sendContactUsEmailValidation,
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

router.get(
  "/products/best-sellers-for-month",
  onlineStoreFrontController.getBestSellingProductsForMonth
);

router.get(
  "/products/categories/",
  onlineStoreFrontController.getAllCategoriesInOnlineStoreFront
);

router.post(
  "/contact-us",
  sendContactUsEmailValidation,
  onlineStoreFrontController.sendContactUsEmail
);

router.put(
  "/products/:productId/purchase-method",
  onlineStoreFrontController.updateProductPurchaseMethod
);

router.use(errorHandler);
module.exports = router;
