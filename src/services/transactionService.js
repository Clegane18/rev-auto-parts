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

const returnProduct = async ({
  receiptNumber,
  productIdToReturn,
  quantityToReturn,
}) => {
  try {
    // Find the transaction based on the receipt number
    const transaction = await TransactionHistories.findOne({
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

module.exports = { buyProductsOnPhysicalStore, returnProduct };
