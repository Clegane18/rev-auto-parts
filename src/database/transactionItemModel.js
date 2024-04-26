const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const Product = require("./inventoryProductModel");
const TransactionHistory = require("./transactionHistoryModel");

const TransactionItem = sequelize.define("TransactionItem", {
  transactionItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
      model: "TransactionHistory", // Name of the referenced model
      key: "transactionId", // Primary key in the referenced model
    },
  },
});

// Define associations
TransactionHistory.hasMany(TransactionItem, {
  foreignKey: "transactionId",
});
TransactionItem.belongsTo(TransactionHistory, {
  foreignKey: "transactionId",
});

TransactionItem.belongsTo(Product, {
  foreignKey: "productId",
});

module.exports = TransactionItem;
