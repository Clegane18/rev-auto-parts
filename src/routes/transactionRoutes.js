const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const {
  buyProductsValidation,
  returnProductValidation,
} = require("../middlewares/validators");
const transactionController = require("../controllers/transactionController");

router.post("/products/buyProducts/", transactionController.buyProducts);

router.post(
  "/products/returnProduct/:receiptNumber",
  returnProductValidation,
  transactionController.returnProduct
);

router.use(errorHandler);

module.exports = router;
