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

router.get(
  "/income/totalIncome",
  transactionController.calculateTotalIncomeInPhysicalStore
);

router.get(
  "/income/monthlyIncome",
  transactionController.calculateIncomeByMonthInPhysicalStore
);

router.get("/today/total", transactionController.getTotalNumberTransactions);

router.get(
  "/today/total/pos",
  transactionController.getTotalCountOfTransactionsFromPOS
);

router.get(
  "/today/total/online",
  transactionController.getTotalCountOfTransactionsFromOnline
);

router.use(errorHandler);
module.exports = router;
