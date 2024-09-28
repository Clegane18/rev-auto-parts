const express = require("express");
const router = express.Router();
const {
  uploadProductPhotoValidation,
  unpublishedItemByIdValidation,
  getProductByIdAndPublishValidation,
  sendContactUsEmailValidation,
} = require("../middlewares/validators");
const onlineStoreFrontController = require("../controllers/onlineStoreFrontController");
const upload = require("../middlewares/multerConfig");
const showcaseUpload = require("../middlewares/multerConfigShowcaseProducts");

router.post(
  "/uploadPhotos/:productId",
  upload.array("files", 10),
  uploadProductPhotoValidation,
  onlineStoreFrontController.uploadProductImages
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

router.delete(
  "/products/:productImageId/delete-product-image",
  onlineStoreFrontController.deleteProductImageById
);

router.put(
  "/products/:productImageId/change-primary-product-image",
  onlineStoreFrontController.changePrimaryProductImageById
);

router.get(
  "/products/:productId/images",
  onlineStoreFrontController.getAllProductImagesByProductId
);

router.post(
  "/showcase-upload",
  showcaseUpload.array("files", 10),
  onlineStoreFrontController.uploadShowcaseImages
);

router.get("/showcase-images", onlineStoreFrontController.getShowcaseImages);

module.exports = router;
