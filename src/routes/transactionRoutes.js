const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const {
  buyProductsOnPhysicalStoreValidation,
} = require("../middlewares/validators");
const transactionController = require("../controllers/transactionController");

router.post(
  "/products/buyProducts",
  buyProductsOnPhysicalStoreValidation,
  transactionController.buyProductsOnPhysicalStore
);

router.use(errorHandler);
module.exports = router;
