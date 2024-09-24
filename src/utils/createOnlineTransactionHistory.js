const TransactionHistories = require("../database/models/transactionHistoryModel");
const TransactionItems = require("../database/models/transactionItemModel");
const Product = require("../database/models/inventoryProductModel");

const createOnlineTransactionHistory = async ({
  items,
  totalAmount,
  customerId,
  salesLocation = "online",
  t,
}) => {
  try {
    const transaction = await TransactionHistories.create(
      {
        transactionNo: `TXN-${Date.now()}`,
        transactionType: "purchase",
        transactionStatus: "completed",
        transactionDate: new Date(),
        totalAmount,
        totalItemsBought: items.length,
        salesLocation,
      },
      { transaction: t }
    );

    const transactionItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findByPk(item.productId, {
          transaction: t,
        });
        if (!product) {
          throw {
            status: 404,
            data: { message: `Product with ID ${item.productId} not found` },
          };
        }

        return TransactionItems.create(
          {
            productId: item.productId,
            productName: product.name,
            quantity: item.quantity,
            unitPrice: product.price,
            subtotalAmount: product.price * item.quantity,
            amountPaid: 0,
            transactionId: transaction.transactionId,
          },
          { transaction: t }
        );
      })
    );

    return { transaction, transactionItems };
  } catch (error) {
    console.error("Error in createOnlineTransactionHistory:", error);
    throw error;
  }
};
module.exports = { createOnlineTransactionHistory };
