const Product = require("../database/models/inventoryProductModel");
const TransactionHistories = require("../database/models/transactionHistoryModel");
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

module.exports = { buyProductsOnPhysicalStore };
