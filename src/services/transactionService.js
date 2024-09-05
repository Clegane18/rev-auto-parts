const { Product } = require("../database/models");
const TransactionHistories = require("../database/models/transactionHistoryModel");
const TransactionItems = require("../database/models/transactionItemModel");
const { createTransaction } = require("../utils/transactionUtils");
const { Op } = require("sequelize");

const buyProductsOnPhysicalStore = async ({ items, paymentAmount }) => {
  try {
    const { receipt } = await createTransaction(items, paymentAmount);

    return {
      status: 201,
      data: {
        receipt,
      },
    };
  } catch (error) {
    console.error("Error in buyProductsOnPhysicalStore service:", error);
    throw error;
  }
};

const calculateTotalIncome = async () => {
  try {
    const transactions = await TransactionHistories.findAll({
      include: [
        {
          model: TransactionItems,
          include: [Product],
        },
      ],
    });

    let totalGrossIncome = 0;
    let totalNetIncome = 0;

    transactions.forEach((transaction) => {
      transaction.TransactionItems.forEach((item) => {
        const grossIncome = parseFloat(item.subtotalAmount);
        const supplierCost = parseFloat(item.Product.supplierCost);
        const quantity = item.quantity;
        const netIncome = grossIncome - supplierCost * quantity;

        totalGrossIncome += grossIncome;
        totalNetIncome += netIncome;
      });
    });

    return {
      status: 200,
      message: "Total income calculated successfully",
      data: {
        totalGrossIncome: totalGrossIncome.toLocaleString(),
        totalNetIncome: totalNetIncome.toLocaleString(),
      },
    };
  } catch (error) {
    console.error("Error in calculateTotalIncome service:", error);
    throw error;
  }
};

const calculateTotalIncomeByMonth = async () => {
  try {
    const transactions = await TransactionHistories.findAll({
      include: [
        {
          model: TransactionItems,
          include: [Product],
        },
      ],
    });

    const incomeByMonth = {};

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const monthYear = `${transactionDate.getFullYear()}-${String(
        transactionDate.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!incomeByMonth[monthYear]) {
        incomeByMonth[monthYear] = { totalGrossIncome: 0, totalNetIncome: 0 };
      }

      transaction.TransactionItems.forEach((item) => {
        const grossIncome = parseFloat(item.subtotalAmount);
        const supplierCost = parseFloat(item.Product.supplierCost);
        const quantity = item.quantity;
        const netIncome = grossIncome - supplierCost * quantity;

        incomeByMonth[monthYear].totalGrossIncome += grossIncome;
        incomeByMonth[monthYear].totalNetIncome += netIncome;
      });
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    for (let month = 1; month <= currentMonth; month++) {
      const monthYear = `${currentYear}-${String(month).padStart(2, "0")}`;
      if (!incomeByMonth[monthYear]) {
        incomeByMonth[monthYear] = {
          totalGrossIncome: "0",
          totalNetIncome: "0",
        };
      }
    }

    Object.keys(incomeByMonth).forEach((monthYear) => {
      incomeByMonth[monthYear].totalGrossIncome =
        incomeByMonth[monthYear].totalGrossIncome.toLocaleString();
      incomeByMonth[monthYear].totalNetIncome =
        incomeByMonth[monthYear].totalNetIncome.toLocaleString();
    });

    const sortedData = Object.keys(incomeByMonth)
      .sort()
      .reduce((acc, key) => {
        acc[key] = incomeByMonth[key];
        return acc;
      }, {});

    return {
      status: 200,
      message: "Total income calculated successfully",
      data: sortedData,
    };
  } catch (error) {
    console.error("Error in calculateTotalIncomeByMonth service:", error);
    throw error;
  }
};

const getTotalNumberTransactions = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const totalTransactions = await TransactionHistories.count({
      where: {
        transactionDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    return {
      status: 200,
      message: "All transactions for today successfully fetched",
      TotalTransactions: totalTransactions,
    };
  } catch (error) {
    console.error("Error in getTotalNumberTransactions service:", error);
    throw error;
  }
};

const getTotalCountOfTransactionsFromPOS = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const totalTransactions = await TransactionHistories.count({
      where: {
        salesLocation: "POS",
        transactionDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    return {
      status: 200,
      message: "The total count of transactions from POS successfully fetched",
      TotalCountOfTransactions: totalTransactions,
    };
  } catch (error) {
    console.error(
      "Error in getTotalCountOfTransactionsFromPOS service:",
      error
    );
    throw error;
  }
};

const getTotalCountOfTransactionsFromOnline = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const totalTransactions = await TransactionHistories.count({
      where: {
        salesLocation: "online",
        transactionDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    return {
      status: 200,
      message:
        "The total count of transactions from Online  Store Front successfully fetched",
      TotalCountOfTransactions: totalTransactions,
    };
  } catch (error) {
    console.error(
      "Error in getTotalCountOfTransactionsFromOnline service:",
      error
    );
    throw error;
  }
};

const getTodaysTransactions = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysTransactions = await TransactionHistories.findAll({
      where: {
        transactionDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (!todaysTransactions) {
      throw {
        status: 404,
        data: { message: "There's no transaction today." },
      };
    }

    return {
      status: 200,
      message: "Today's transactions successfully fetched.",
      TodaysTransactions: todaysTransactions,
    };
  } catch (error) {
    console.error("Error in getTodaysTransactions service:", error);
    throw error;
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
