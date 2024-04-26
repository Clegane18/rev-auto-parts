const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const inventoryController = require("../controllers/inventoryController");
const {
  createProductValidation,
  updateProductValidation,
} = require("../middlewares/validators");

router.post(
  "/addProduct",
  createProductValidation,
  inventoryController.addProduct
);
router.put(
  "/addToProductStock/:productId",
  inventoryController.addToProductStock
);
router.put(
  "/updateProductById/:productId",
  updateProductValidation,
  inventoryController.updateProductById
);
router.get("/products", inventoryController.getAllProducts);
router.get("/getProductById/:productId", inventoryController.getProductById);
router.get(
  "/products/itemCode/:productItemCode",
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
router.delete("/products/:productId", inventoryController.deleteProductById);

router.use(errorHandler);

module.exports = router;
