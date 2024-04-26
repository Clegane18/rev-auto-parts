const Product = require("../database/inventoryProductModel");
const TransactionHistory = require("../database/transactionHistoryModel");
const {
  generateTransactionReceipt,
  createTransactionHistory,
} = require("../utils/transactionUtils");

const buyProducts = async ({ items, amountPaid }) => {
  try {
    // Validate products, stock, and amount paid
    let totalPaid = 0;

    for (const item of items) {
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
          data: { message: `Insufficient stock for product: ${product.name}` },
        };
      }

      const costForItems = product.price * item.quantity;
      totalPaid += costForItems;

      if (amountPaid < costForItems) {
        throw {
          status: 400,
          data: {
            message: `Insufficient amount paid for product: ${product.name}`,
          },
        };
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // Generate a unique transaction number

    const transaction = await createTransactionHistory({
      transactionType: "purchase",
      transactionAmount: totalPaid,
      transactionStatus: "completed",
      description: "Products purchased",
    });

    // Generate transaction receipt
    const receipt = await generateTransactionReceipt(transaction.transactionId);

    return {
      status: 200,
      message: "Products purchased successfully",
      receipt: receipt,
    };
  } catch (error) {
    console.error("Error in buyProducts service:", error);
    throw error;
  }
};

const returnProduct = async ({
  receiptNumber,
  productIdToReturn,
  quantityToReturn,
}) => {
  try {
    // Find the transaction based on the receipt number
    const transaction = await TransactionHistory.findOne({
      where: { transactionReceipt: receiptNumber },
    });

    if (!transaction) {
      throw {
        status: 404,
        data: {
          message: `Transaction not found with receipt number: ${receiptNumber}`,
        },
      };
    }

    // Retrieve the product associated with the transaction
    const product = await Product.findByPk(transaction.productId);

    if (!product) {
      throw {
        status: 404,
        data: {
          message: `Product not found with ID: ${transaction.productId}`,
        },
      };
    }

    // Ensure the requested product to return matches the transaction
    if (productIdToReturn !== transaction.productId) {
      throw {
        status: 400,
        data: {
          message: `Product ID to return does not match the transaction`,
        },
      };
    }

    // Ensure the requested quantity to return is not more than the purchased quantity
    if (quantityToReturn > transaction.quantity) {
      throw {
        status: 400,
        data: {
          message: `Quantity to return exceeds the purchased quantity`,
        },
      };
    }

    // Update product stock to reflect the return
    product.stock += quantityToReturn;
    await product.save();

    // Update the transaction status to indicate the return
    await transaction.update({ transactionStatus: "returned" });

    return {
      status: 200,
      message: "Product return processed successfully",
    };
  } catch (error) {
    console.error("Error in returnProduct service:", error);
    throw error;
  }
};

module.exports = { buyProducts, returnProduct };
