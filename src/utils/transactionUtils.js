// Import any necessary modules or libraries
const TransactionItem = require("../database/transactionItemModel"); // Assuming you have a model for TransactionItem
const TransactionHistory = require("../database/transactionHistoryModel"); // Assuming you have a model for TransactionHistory

// Define the receipt utility function
const generateTransactionReceipt = async (transactionId) => {
  try {
    // Fetch transaction details from the database based on the transaction ID
    const transaction = await TransactionHistory.findByPk(transactionId, {
      include: [TransactionItem], // Include associated transaction items
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Format the transaction data into a readable format for the receipt
    let receiptContent = `Transaction Receipt\n`;
    receiptContent += `-------------------\n`;
    receiptContent += `Transaction Number: ${transaction.transactionNo}\n`;
    receiptContent += `Date: ${transaction.createdAt.toLocaleString()}\n`;
    receiptContent += `-------------------\n`;
    receiptContent += `Items Purchased:\n`;

    // Iterate over each item in the transaction and add it to the receipt content
    transaction.TransactionItems.forEach((item, index) => {
      receiptContent += `${index + 1}. ${item.productName} - Quantity: ${
        item.quantity
      }, Unit Price: $${item.unitPrice}, Subtotal: $${item.subtotalAmount}\n`;
    });

    receiptContent += `-------------------\n`;
    receiptContent += `Total Amount: $${transaction.totalAmount}\n`;
    receiptContent += `-------------------\n`;
    receiptContent += `Thank you for your purchase!\n`;

    // Return the generated receipt content
    return receiptContent;
  } catch (error) {
    console.error("Error generating transaction receipt:", error);
    throw error;
  }
};

// Export the utility function
module.exports = generateTransactionReceipt;
