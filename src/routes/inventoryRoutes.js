const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const {
  createProductValidation,
  updateProductValidation,
  addPendingStockValidation,
  confirmStockValidation,
  cancelStockValidation,
  updateArrivalDateValidation,
} = require("../middlewares/validators");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const auditLogger = require("../middlewares/auditLogger");

router.post(
  "/addProduct",
  authenticateToken,
  createProductValidation,
  auditLogger("Added a new product"),
  inventoryController.addProduct
);

router.put(
  "/addToProductStock/:productId",
  authenticateToken,
  auditLogger(
    (req) => `Added stock to product with ID: ${req.params.productId}`
  ),
  inventoryController.addToProductStock
);

router.put(
  "/updateProductById/:productId",
  authenticateToken,
  updateProductValidation,
  auditLogger((req) => `Updated product with ID: ${req.params.productId}`),
  inventoryController.updateProductById
);

router.get("/products", inventoryController.getAllProducts);

router.get("/getProductById/:productId", inventoryController.getProductById);

router.get(
  "/products/filter/itemCode",
  inventoryController.getProductByItemCode
);

router.get("/products/filter/brand", inventoryController.getProductByBrand);

router.get(
  "/products/filter/price-range",
  inventoryController.getProductByPriceRange
);

router.get(
  "/products/filter/nameOrDescription",
  inventoryController.getProductByNameOrDescription
);

router.get(
  "/products/filter/dateRange",
  inventoryController.getProductsByDateRange
);

router.get(
  "/products/filter/lowStocks",
  inventoryController.getLowStockProducts
);

router.post(
  "/products/pendingStocks/add-pendingStock",
  authenticateToken,
  addPendingStockValidation,
  auditLogger("Added pending stock"),
  inventoryController.addPendingStock
);

router.put(
  "/products/pendingStocks/confirm-stock/:id",
  authenticateToken,
  confirmStockValidation,
  auditLogger((req) => `Confirmed stock with ID: ${req.params.id}`),
  inventoryController.confirmStock
);

router.put(
  "/products/pendingStocks/cancel-stock/:id",
  authenticateToken,
  cancelStockValidation,
  auditLogger((req) => `Canceled stock with ID: ${req.params.id}`),
  inventoryController.cancelPendingStock
);

router.get("/products/pending-stocks", inventoryController.getAllPendingStocks);

router.put(
  "/products/pendingStocks/updateArrivalDate/:id",
  authenticateToken,
  updateArrivalDateValidation,
  auditLogger(
    (req) => `Updated arrival date for stock with ID: ${req.params.id}`
  ),
  inventoryController.updateArrivalDate
);

router.get(
  "/products/best-seller-items",
  inventoryController.getTopBestSellerItems
);

router.get("/products/totalNumberOfStocks", inventoryController.getTotalStock);

router.get("/products/totalNumberOfItems", inventoryController.getTotalItems);

router.get(
  "/products/itemsByCategory",
  inventoryController.getAllItemsByCategory
);

router.get(
  "/online-products/filter/nameOrDescription",
  inventoryController.getPublishedProducts
);

router.get(
  "/products/filter/status",
  inventoryController.getAllProductsByStatus
);

module.exports = router;
