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

const calculateIncomeInPhysicalStore = async () => {
  const transactions = await TransactionHistories.findAll({
    include: [
      {
        model: TransactionItems,
        required: true,
      },
    ],
  });

  let grossIncome = 0;
  let netIncome = 0;

  transactions.forEach((transaction) => {
    const totalAmount = parseFloat(transaction.totalAmount);
    grossIncome += totalAmount;

    let totalExpenses = 0;
  });
};
//calculateIncomeByMonthInPhysicalStore
module.exports = { buyProductsOnPhysicalStore, calculateIncomeInPhysicalStore };
