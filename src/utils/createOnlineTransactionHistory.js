const TransactionHistories = require("../database/models/transactionHistoryModel");
const TransactionItems = require("../database/models/transactionItemModel");
const Product = require("../database/models/inventoryProductModel");

/**
 * Creates a transaction history record for an online store order.
 * @param {Object} orderData - The order data containing customerId, addressId, items, paymentAmount, and salesLocation.
 * @param {Array} items - The list of items to be purchased.
 * @param {Number} totalAmount - The total amount of the order (merchandise + shipping).
 * @param {Object} transaction - Sequelize transaction instance for transaction management.
 * @returns {Object} - The created transaction history and associated items.
 */
const createOnlineTransactionHistory = async ({
  items,
  totalAmount,
  customerId,
  salesLocation = "online",
  t,
}) => {
  try {
    // Create the transaction history record
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

    // Process each transaction item and update product stock
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

        if (product.stock < item.quantity) {
          throw {
            status: 400,
            data: {
              message: `Insufficient stock for product: ${product.name}`,
            },
          };
        }

        // Update product stock
        product.stock -= item.quantity;
        await product.save({ transaction: t });

        // Create transaction item record
        return TransactionItems.create(
          {
            productId: item.productId,
            productName: product.name,
            quantity: item.quantity,
            unitPrice: product.price,
            subtotalAmount: product.price * item.quantity,
            amountPaid: 0, // Handle COD later if applicable
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
