const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const TransactionHistories = sequelize.define("TransactionHistories", {
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  transactionNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  transactionType: {
    type: DataTypes.STRING,
    allowNull: false,
    // Types could include 'purchase', 'refund', 'return', etc.
  },
  transactionStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    // Examples: 'completed', 'refunded', 'returned'
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalItemsBought: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  salesLocation: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "physical",
  },
});

module.exports = TransactionHistories;
