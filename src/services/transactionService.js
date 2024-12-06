const { Product } = require("../database/models");
const TransactionHistories = require("../database/models/transactionHistoryModel");
const TransactionItems = require("../database/models/transactionItemModel");
const { createTransaction } = require("../utils/transactionUtils");
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const parseDate = require("../utils/dateParser");

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

const calculateTotalIncomeByMonth = async ({ date = null }) => {
  try {
    let start, end;

    if (date) {
      const queryDate = new Date(date);
      const year = queryDate.getFullYear();
      const month = queryDate.getMonth();

      start = new Date(year, month, 1);
      end = new Date(year, month + 1, 0);
    } else {
      const currentYear = new Date().getFullYear();
      start = new Date(currentYear, 0, 1);
      end = new Date(currentYear, 11, 31);
    }

    const transactions = await TransactionHistories.findAll({
      include: [
        {
          model: TransactionItems,
          include: [Product],
        },
      ],
      where: {
        transactionDate: {
          [Op.between]: [start, end],
        },
      },
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

    const year = new Date(start).getFullYear();
    for (let month = 0; month < 12; month++) {
      const monthYear = `${year}-${String(month + 1).padStart(2, "0")}`;
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

const getTotalNumberTransactions = async ({ date = null }) => {
  try {
    let dateRange;

    if (date) {
      dateRange = parseDate(date);

      if (!dateRange) {
        return {
          status: 400,
          data: {
            message:
              "Invalid date format. Please provide a valid date in YYYY-MM-DD format.",
          },
        };
      }
    } else {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      dateRange = { startOfDay, endOfDay };
    }

    const { startOfDay, endOfDay } = dateRange;

    const totalTransactions = await TransactionHistories.count({
      where: {
        transactionDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    return {
      status: 200,
      message: "Transactions successfully fetched for the specified day.",
      totalTransactions,
    };
  } catch (error) {
    console.error("Error in getTotalNumberTransactions service:", error);
    return {
      status: 500,
      data: {
        message: "An error occurred while fetching transactions.",
        error: error.message,
      },
    };
  }
};

const getTotalCountOfTransactionsFromPOS = async ({ date = null }) => {
  try {
    let dateRange;

    if (date) {
      dateRange = parseDate(date);

      if (!dateRange) {
        return {
          status: 400,
          data: {
            message:
              "Invalid date format. Please provide a valid date in YYYY-MM-DD format.",
          },
        };
      }
    } else {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      dateRange = { startOfDay, endOfDay };
    }

    const { startOfDay, endOfDay } = dateRange;

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
      message: "The total count of transactions from POS successfully fetched.",
      TotalCountOfTransactions: totalTransactions,
    };
  } catch (error) {
    console.error(
      "Error in getTotalCountOfTransactionsFromPOS service:",
      error
    );
    return {
      status: 500,
      data: {
        message: "An error occurred while fetching POS transactions.",
        error: error.message,
      },
    };
  }
};

const getTotalCountOfTransactionsFromOnline = async ({ date = null }) => {
  try {
    let dateRange;

    if (date) {
      dateRange = parseDate(date);

      if (!dateRange) {
        return {
          status: 400,
          data: {
            message:
              "Invalid date format. Please provide a valid date in YYYY-MM-DD format.",
          },
        };
      }
    } else {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      dateRange = { startOfDay, endOfDay };
    }

    const { startOfDay, endOfDay } = dateRange;

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
        "The total count of transactions from Online Store Front successfully fetched.",
      TotalCountOfTransactions: totalTransactions,
    };
  } catch (error) {
    console.error(
      "Error in getTotalCountOfTransactionsFromOnline service:",
      error
    );
    return {
      status: 500,
      data: {
        message: "An error occurred while fetching Online Store transactions.",
        error: error.message,
      },
    };
  }
};

const getTodaysTransactions = async ({ date = null }) => {
  try {
    let dateRange;

    if (date) {
      dateRange = parseDate(date);

      if (!dateRange) {
        return {
          status: 400,
          data: {
            message:
              "Invalid date format. Please provide a valid date in YYYY-MM-DD format.",
          },
        };
      }
    } else {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      dateRange = { startOfDay, endOfDay };
    }

    const { startOfDay, endOfDay } = dateRange;

    const todaysTransactions = await TransactionHistories.findAll({
      where: {
        transactionDate: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (!todaysTransactions || todaysTransactions.length === 0) {
      return {
        status: 404,
        data: { message: "There are no transactions for the specified day." },
      };
    }

    return {
      status: 200,
      message: "Today's transactions successfully fetched.",
      TodaysTransactions: todaysTransactions,
    };
  } catch (error) {
    console.error("Error in getTodaysTransactions service:", error);
    return {
      status: 500,
      data: {
        message: "An error occurred while fetching today's transactions.",
        error: error.message,
      },
    };
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
