const Product = require("../database/inventoryProductModel");
const moment = require("moment");

const generateReferenceNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000);

  const referenceNumber = timestamp + random;

  return referenceNumber;
};

const generateReceipt = async (items, amountPaid) => {
  try {
    let receiptItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        throw new Error(`Product not found with ID: ${item.productId}`);
      }

      // Convert product price to a number if it's a string
      const price =
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price;

      const totalPrice = price * item.quantity;
      subtotal += totalPrice;
      receiptItems.push(
        `${product.name.padEnd(25)}x${item.quantity
          .toString()
          .padEnd(4)}$${price.toFixed(2)}`
      );
    }

    const total = subtotal;
    const change = amountPaid - total;

    // Date and Time formatting
    const now = moment();
    const date = now.format("YYYY-MM-DD");
    const time = now.format("HH:mm");
    const transactionNumber = generateReferenceNumber();

    // Building the receipt string
    let receipt = `===============================
         G&c GearTrack
    Automotive Supplies Co.
     123 Example Address 
         (555) 123-4567
     www.gandcgeartrack.com
===============================
Date: ${date}
Time: ${time}
Transaction #: ${transactionNumber}

Items Purchased:\n`;

    receipt += receiptItems.join("\n") + "\n\n";

    receipt += `Subtotal:                    $${subtotal.toFixed(2)}\n`;
    receipt += `Total:                       $${total.toFixed(2)}\n\n`;
    receipt += `Amount Paid:                 $${amountPaid.toFixed(2)}\n`;
    receipt += `Change:                      $${change.toFixed(2)}\n\n`;
    receipt += `Thank you for your business!
===============================`;

    // Replace newline characters with actual line breaks
    receipt = receipt.replace(/\n/g, "\n");

    return receipt;
  } catch (error) {
    console.error("Error generating receipt:", error);
    throw error;
  }
};

module.exports = {
  generateReceipt,
};
