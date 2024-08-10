const transactionService = require("../services/transactionService");

const buyProductsOnPhysicalStore = async (req, res) => {
  try {
    const result = await transactionService.buyProductsOnPhysicalStore({
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      paymentAmount: req.body.paymentAmount,
    });
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error buying products on physical store:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const calculateTotalIncomeInPhysicalStore = async (req, res) => {
  try {
    const result =
      await transactionService.calculateTotalIncomeInPhysicalStore();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error calculating total income in physical store", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const calculateTotalIncomeByMonth = async (req, res) => {
  try {
    const result = await transactionService.calculateTotalIncomeByMonth();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error calculating total income in by month", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getTotalNumberTransactions = async (req, res) => {
  try {
    const result = await transactionService.getTotalNumberTransactions();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching total count of transactions today", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getTotalCountOfTransactionsFromPOS = async (req, res) => {
  try {
    const result =
      await transactionService.getTotalCountOfTransactionsFromPOS();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching total count of transactions from POS", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getTotalCountOfTransactionsFromOnline = async (req, res) => {
  try {
    const result =
      await transactionService.getTotalCountOfTransactionsFromOnline();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(
      "Error fetching total count of transactions from online store front",
      error
    );
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getTodaysTransactions = async (req, res) => {
  try {
    const result = await transactionService.getTodaysTransactions();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching today's transactions", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};
module.exports = {
  buyProductsOnPhysicalStore,
  calculateTotalIncomeInPhysicalStore,
  calculateTotalIncomeByMonth,
  getTotalNumberTransactions,
  getTotalCountOfTransactionsFromPOS,
  getTotalCountOfTransactionsFromOnline,
  getTodaysTransactions,
};
