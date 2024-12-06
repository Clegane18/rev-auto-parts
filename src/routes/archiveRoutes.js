const express = require("express");
const router = express.Router();
const archiveController = require("../controllers/archiveController");
const { deleteProductByIdValidation } = require("../middlewares/validators");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const auditLogger = require("../middlewares/auditLogger");

router.post(
  "/products/archive/:productId",
  authenticateToken,
  auditLogger((req) => `Archived product with ID: ${req.params.productId}`),
  archiveController.archiveProductById
);

router.post(
  "/archive/restore/:productId",
  authenticateToken,
  auditLogger(
    (req) => `Restored archived product with ID: ${req.params.productId}`
  ),
  archiveController.restoreArchivedProductsById
);

router.delete(
  "/products/:productId",
  authenticateToken,
  deleteProductByIdValidation,
  auditLogger(
    (req) =>
      `Permanently deleted archived product with ID: ${req.params.productId}`
  ),
  archiveController.permanentlyDeleteArchivedProduct
);

router.post(
  "/archive/delete-all",
  authenticateToken,
  auditLogger("Deleted all archived products"),
  archiveController.deleteAllArchivedProducts
);

router.get(
  "/archived/products",

  archiveController.getAllArchivedProducts
);

router.post(
  "/archive/restore-multiple",
  archiveController.restoreMultipleArchivedProducts
);

router.post(
  "/archive/restore-all",
  archiveController.restoreAllArchivedProducts
);

router.post("/auto-delete", archiveController.autoDeleteArchivedProducts);

module.exports = router;
