const TransactionHistories = require("../database/models/transactionHistoryModel");
const TransactionItems = require("../database/models/transactionItemModel");
const Product = require("../database/models/inventoryProductModel");

const createTransaction = async (items, paymentAmount) => {
  try {
    const { totalAmount, itemsWithPrices } = await calculateTotalAmount(items);

    if (paymentAmount < totalAmount) {
      throw {
        status: 400,
        data: {
          message: `Insufficient payment amount. Total amount is ${totalAmount}, but payment amount is ${paymentAmount}.`,
        },
      };
    }

    const transaction = await createTransactionRecord(
      itemsWithPrices,
      totalAmount
    );
    const transactionItems = await processTransactionItems(
      itemsWithPrices,
      paymentAmount,
      transaction.transactionId
    );

    const receipt = generateReceipt(
      transaction,
      transactionItems,
      paymentAmount
    );

    return { transaction, transactionItems, receipt };
  } catch (error) {
    console.error("Error in createTransaction:", error);
    throw error;
  }
};

const calculateTotalAmount = async (items) => {
  let totalAmount = 0;
  const itemsWithPrices = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        throw {
          status: 404,
          data: { message: `Product not found with ID: ${item.productId}` },
        };
      }
      const unitPrice = product.price;
      const subtotalAmount = unitPrice * item.quantity;
      totalAmount += subtotalAmount;
      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: unitPrice,
        subtotalAmount: subtotalAmount,
      };
    })
  );

  return { totalAmount, itemsWithPrices };
};

const createTransactionRecord = async (items, totalAmount) => {
  return await TransactionHistories.create({
    transactionNo: generateTransactionNo(),
    transactionType: "purchase",
    transactionStatus: "completed",
    totalAmount,
    totalItemsBought: items.length,
  });
};

const processTransactionItems = async (items, paymentAmount, transactionId) => {
  return await Promise.all(
    items.map(async (item) => {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        throw {
          status: 404,
          data: { message: `Product not found with ID: ${item.productId}` },
        };
      }

      if (product.stock < item.quantity) {
        throw {
          status: 400,
          data: { message: `Not enough stock for product ${product.name}` },
        };
      }

      product.stock -= item.quantity;
      await product.save();

      return TransactionItems.create({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotalAmount: product.price * item.quantity,
        amountPaid: paymentAmount,
        transactionId,
      });
    })
  );
};

const generateTransactionNo = () => {
  return `TXN-${Date.now()}`;
};

const generateReceipt = (transaction, transactionItems, paymentAmount) => {
  const receipt = {
    transactionNo: transaction.transactionNo,
    transactionDate: transaction.createdAt,
    items: transactionItems.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotalAmount: item.subtotalAmount,
    })),
    totalAmount: transaction.totalAmount,
    paymentAmount: paymentAmount,
    change: paymentAmount - transaction.totalAmount,
  };
  return receipt;
};

module.exports = {
  createTransaction,
};
