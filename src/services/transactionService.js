const { Product } = require("../database/models");
const TransactionHistories = require("../database/models/transactionHistoryModel");
const TransactionItems = require("../database/models/transactionItemModel");
const { createTransaction } = require("../utils/transactionUtils");

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
};

const calculateIncomeByMonthInPhysicalStore = async () => {
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

  // Convert the income values to locale strings
  Object.keys(incomeByMonth).forEach((monthYear) => {
    incomeByMonth[monthYear].totalGrossIncome =
      incomeByMonth[monthYear].totalGrossIncome.toLocaleString();
    incomeByMonth[monthYear].totalNetIncome =
      incomeByMonth[monthYear].totalNetIncome.toLocaleString();
  });

  return {
    status: 200,
    message: "Total income calculated successfully",
    data: incomeByMonth,
  };
};

module.exports = {
  buyProductsOnPhysicalStore,
  calculateTotalIncomeInPhysicalStore,
  calculateIncomeByMonthInPhysicalStore,
};
