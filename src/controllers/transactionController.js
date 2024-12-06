const transactionService = require("../services/transactionService");

const buyProductsOnPhysicalStore = async (req, res) => {
  try {
    const result = await transactionService.buyProductsOnPhysicalStore({
      adminId: req.user.id,
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

const calculateTotalIncome = async (req, res) => {
  try {
    const result = await transactionService.calculateTotalIncome();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error calculating total income:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const calculateTotalIncomeByMonth = async (req, res) => {
  try {
    const result = await transactionService.calculateTotalIncomeByMonth({
      date: req.query.date,
    });

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
    const result = await transactionService.getTotalNumberTransactions({
      date: req.query.date,
    });

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
    const result = await transactionService.getTotalCountOfTransactionsFromPOS({
      date: req.query.date,
    });

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
      await transactionService.getTotalCountOfTransactionsFromOnline({
        date: req.query.date,
      });
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
    const result = await transactionService.getTodaysTransactions({
      date: req.query.date,
    });
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
  calculateTotalIncome,
  calculateTotalIncomeByMonth,
  getTotalNumberTransactions,
  getTotalCountOfTransactionsFromPOS,
  getTotalCountOfTransactionsFromOnline,
  getTodaysTransactions,
};
