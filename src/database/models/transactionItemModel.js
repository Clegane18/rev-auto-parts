const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const TransactionItems = sequelize.define("TransactionItems", {
  transactionItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Product", // Name of the referenced model
      key: "id", // Primary key in the referenced model
    },
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "TransactionHistories", // Name of the referenced model
      key: "transactionId", // Primary key in the referenced model
    },
  },
});

module.exports = TransactionItems;
