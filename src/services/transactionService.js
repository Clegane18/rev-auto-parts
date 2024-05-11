// const Product = require("../database/inventoryProductModel");
// const TransactionHistory = require("../database/transactionHistoryModel");
// const {
//   generateTransactionReceipt,
//   createTransactionHistory,
// } = require("../utils/transactionUtils");

// const buyProducts = async ({ items, amountPaid }) => {
//   try {
//     // Validate products, stock, and amount paid
//     let totalPaid = 0;
//     const transactionItems = [];

//     for (const item of items) {
//       const product = await Product.findByPk(item.productId);

//       // Validation logic...

//       // Store transaction item for history
//       const costForItems = product.price * item.quantity;
//       totalPaid += costForItems;
//       product.stock -= item.quantity;
//       await product.save();

//       transactionItems.push({
//         productId: product.id,
//         productName: product.name,
//         quantity: item.quantity,
//         unitPrice: product.price,
//         subtotalAmount: costForItems,
//       });
//     }

//     // Generate a unique transaction number
//     const transactionNo = 23925972389;

//     // Create transaction history record
//     const transaction = await TransactionHistory.create({
//       transactionNo,
//       transactionType: "purchase",
//       transactionStatus: "completed",
//       totalAmount: totalPaid,
//       totalItemsBought: items.length,
//     });

//     // Associate transaction items with the transaction history
//     // await TransactionItem.bulkCreate(
//     //   transactionItems.map((item) => ({
//     //     ...item,
//     //     transactionId: transaction.transactionId,
//     //     amountPaid: amountPaid,
//     //   }))
//     // );

//     // Generate transaction receipt
//     const receipt = await generateTransactionReceipt(transaction.transactionId);

//     // Print receipt (redirecting to printer service)
//     // await printReceipt(receipt);

//     return {
//       status: 200,
//       message: "Products purchased successfully",
//       receipt: receipt,
//     };
//   } catch (error) {
//     console.error("Error in buyProducts service:", error);
//     throw error;
//   }
// };

// const returnProduct = async ({
//   receiptNumber,
//   productIdToReturn,
//   quantityToReturn,
// }) => {
//   try {
//     // Find the transaction based on the receipt number
//     const transaction = await TransactionHistory.findOne({
//       where: { transactionReceipt: receiptNumber },
//     });

//     if (!transaction) {
//       throw {
//         status: 404,
//         data: {
//           message: `Transaction not found with receipt number: ${receiptNumber}`,
//         },
//       };
//     }

//     // Retrieve the product associated with the transaction
//     const product = await Product.findByPk(transaction.productId);

//     if (!product) {
//       throw {
//         status: 404,
//         data: {
//           message: `Product not found with ID: ${transaction.productId}`,
//         },
//       };
//     }

//     // Ensure the requested product to return matches the transaction
//     if (productIdToReturn !== transaction.productId) {
//       throw {
//         status: 400,
//         data: {
//           message: `Product ID to return does not match the transaction`,
//         },
//       };
//     }

//     // Ensure the requested quantity to return is not more than the purchased quantity
//     if (quantityToReturn > transaction.quantity) {
//       throw {
//         status: 400,
//         data: {
//           message: `Quantity to return exceeds the purchased quantity`,
//         },
//       };
//     }

//     // Update product stock to reflect the return
//     product.stock += quantityToReturn;
//     await product.save();

//     // Update the transaction status to indicate the return
//     await transaction.update({ transactionStatus: "returned" });

//     return {
//       status: 200,
//       message: "Product return processed successfully",
//     };
//   } catch (error) {
//     console.error("Error in returnProduct service:", error);
//     throw error;
//   }
// };

// module.exports = { buyProducts, returnProduct };
