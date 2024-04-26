const Product = require("../database/inventoryProductModel");
const TransactionHistory = require("../database/transactionHistoryModel");
const TransactionItem = require("../database/transactionItemModel");

const generateTransactionNumber = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

const generateTransactionReceipt = async (transactionId) => {
  try {
    const transaction = await TransactionHistory.findOne({
      where: { transactionId },
      include: [{ model: TransactionItem, include: Product }],
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const transactionReceipt = {
      transactionId: transaction.transactionId,
      receiptNumber: transaction.transactionNo,
      customerId: transaction.customerId,
      transactionType: transaction.transactionType,
      transactionStatus: transaction.transactionStatus,
      transactionDate: transaction.timeStamp,
      totalAmount: transaction.transactionAmount,
      items: transaction.TransactionItems.map((item) => ({
        productId: item.productId,
        productName: item.Product.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotalAmount: item.subtotalAmount,
      })),
    };

    return transactionReceipt;
  } catch (error) {
    console.error("Error generating transaction receipt:", error);
    throw error;
  }
};

const createTransactionHistory = async ({
  transactionType,
  transactionAmount,
  transactionStatus,
  description,
}) => {
  try {
    const transactionNo = generateTransactionNumber(10); // Adjust the length as needed

    const transaction = await TransactionHistory.create({
      transactionType: transactionType,
      transactionAmount: transactionAmount,
      transactionStatus: transactionStatus,
      description: description,
      transactionNo: transactionNo, // Use the correct field name
      transactionDate: new Date(), // Use transactionDate instead of timeStamp
      totalAmount: transactionAmount,
    });
    return transaction;
  } catch (error) {
    console.error("Error creating transaction history:", error);
    throw error;
  }
};

module.exports = {
  generateTransactionReceipt,
  createTransactionHistory,
};
