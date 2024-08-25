const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const archiveController = require("../controllers/archiveController");
const { deleteProductByIdValidation } = require("../middlewares/validators");

router.post(
  "/products/archive/:productId",
  archiveController.archiveProductById
);

router.get("/archive/products", archiveController.getAllArchivedProducts);

router.post(
  "/archive/restore/:productId",
  archiveController.restoreArchivedProductsById
);

router.post(
  "/archive/restore-multiple",
  archiveController.restoreMultipleArchivedProducts
);

router.post(
  "/archive/restore-all",
  archiveController.restoreAllArchivedProducts
);

router.delete(
  "/products/:productId",
  deleteProductByIdValidation,
  archiveController.permanentlyDeleteArchivedProduct
);

router.post("/archive/delete-all", archiveController.deleteAllArchivedProducts);

router.use(errorHandler);

module.exports = router;
