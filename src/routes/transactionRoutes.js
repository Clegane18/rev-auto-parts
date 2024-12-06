const express = require("express");
const router = express.Router();
const {
  buyProductsOnPhysicalStoreValidation,
} = require("../middlewares/validators");
const transactionController = require("../controllers/transactionController");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const auditLogger = require("../middlewares/auditLogger");

router.post(
  "/products/buyProducts",
  authenticateToken,
  buyProductsOnPhysicalStoreValidation,
  auditLogger("POS purchase processed"),
  transactionController.buyProductsOnPhysicalStore
);

router.get("/income/totalIncome", transactionController.calculateTotalIncome);

router.get(
  "/income/totalMonthlyIncome",
  transactionController.calculateTotalIncomeByMonth
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

router.get("/today", transactionController.getTodaysTransactions);

module.exports = router;
