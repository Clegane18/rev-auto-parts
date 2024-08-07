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

const calculateTotalIncomeInPhysicalStore = async () => {
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
    console.error(
      "Error in calculateTotalIncomeInPhysicalStore service:",
      error
    );
    throw error;
  }
};

const calculateIncomeByMonthInPhysicalStore = async () => {
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
      const monthYear = `${transactionDate.getFullYear()}-${
        transactionDate.getMonth() + 1
      }`;

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

    Object.keys(incomeByMonth).forEach((monthYear) => {
      incomeByMonth[monthYear].totalGrossIncome =
        incomeByMonth[monthYear].totalGrossIncome.toLocaleString();
      incomeByMonth[monthYear].totalNetIncome =
        incomeByMonth[monthYear].totalNetIncome.toLocaleString();
    });

    const currentDate = new Date();
    const currentMonthYear = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }`;

    return {
      status: 200,
      message: "Total income calculated successfully",
      data: {
        [currentMonthYear]: incomeByMonth[currentMonthYear] || {
          totalGrossIncome: "0",
          totalNetIncome: "0",
        },
      },
    };
  } catch (error) {
    console.error(
      "Error in calculateIncomeByMonthInPhysicalStore service:",
      error
    );
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
        "The total count of transactions from Online Store Front successfully fetched",
      TotalTransactions: totalTransactions,
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
  calculateTotalIncomeInPhysicalStore,
  calculateIncomeByMonthInPhysicalStore,
  getTotalNumberTransactions,
  getTotalCountOfTransactionsFromPOS,
  getTotalCountOfTransactionsFromOnline,
  getTodaysTransactions,
};
