const sequelize = require("../db");
const Product = require("./inventoryProductModel");
const PendingStock = require("./pendingStockModel");
const TransactionHistories = require("./transactionHistoryModel");
const TransactionItems = require("./transactionItemModel");

Product.hasMany(PendingStock, {
  foreignKey: "productId",
  sourceKey: "id",
  onDelete: "CASCADE",
});

PendingStock.belongsTo(Product, {
  foreignKey: "productId",
  targetKey: "id",
  onDelete: "CASCADE",
});

TransactionHistories.hasMany(TransactionItems, {
  foreignKey: "transactionId",
});
TransactionItems.belongsTo(TransactionHistories, {
  foreignKey: "transactionId",
});
TransactionItems.belongsTo(Product, {
  foreignKey: "productId",
});

module.exports = {
  Product,
  PendingStock,
  TransactionHistories,
  TransactionItems,
  sequelize,
};
