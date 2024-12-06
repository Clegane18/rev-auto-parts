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
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const auditLogger = require("../middlewares/auditLogger");

router.post(
  "/uploadPhotos/:productId",
  authenticateToken,
  upload.array("files", 10),
  uploadProductPhotoValidation,
  auditLogger(
    (req) => `Uploaded product images for product ID: ${req.params.productId}`
  ),
  onlineStoreFrontController.uploadProductImages
);

router.post(
  "/products/getProductByIdAndPublish/:productId",
  authenticateToken,
  getProductByIdAndPublishValidation,
  auditLogger((req) => `Published product with ID: ${req.params.productId}`),
  onlineStoreFrontController.getProductByIdAndPublish
);

router.get(
  "/products/publishedItems/",
  onlineStoreFrontController.getPublishedItemsByCategory
);

router.post(
  "/products/unpublishedItem/:productId",
  authenticateToken,
  unpublishedItemByIdValidation,
  auditLogger((req) => `Unpublished product with ID: ${req.params.productId}`),
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
  authenticateToken,
  auditLogger(
    (req) => `Deleted product image with ID: ${req.params.productImageId}`
  ),
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
  authenticateToken,
  showcaseUpload.array("files", 10),
  auditLogger("Uploaded showcase images"),
  onlineStoreFrontController.uploadShowcaseImages
);

router.get("/showcase-images", onlineStoreFrontController.getShowcaseImages);

router.delete(
  "/delete-showcase-images/:showcaseId",
  authenticateToken,
  auditLogger((req) => `Deleted showcase with ID: ${req.params.showcaseId}`),
  onlineStoreFrontController.deleteShowcase
);

router.get(
  "/products/top-sellers",
  onlineStoreFrontController.getTopSellingProducts
);

module.exports = router;
