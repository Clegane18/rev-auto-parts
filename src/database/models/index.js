const sequelize = require("../db");
const Product = require("./inventoryProductModel");
const PendingStock = require("./pendingStockModel");
const TransactionHistories = require("./transactionHistoryModel");
const TransactionItems = require("./transactionItemModel");
const Customer = require("./customerModel");
const Address = require("./addressModel");

TransactionHistories.hasMany(TransactionItems, {
  foreignKey: "transactionId",
});
TransactionItems.belongsTo(TransactionHistories, {
  foreignKey: "transactionId",
});
TransactionItems.belongsTo(Product, {
  foreignKey: "productId",
});

Customer.hasMany(Address, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
});

Address.belongsTo(Customer, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
});

module.exports = {
  Product,
  PendingStock,
  TransactionHistories,
  TransactionItems,
  sequelize,
};
