const sequelize = require("../db");
const Product = require("./inventoryProductModel");
const PendingStock = require("./pendingStockModel");
const TransactionHistories = require("./transactionHistoryModel");
const TransactionItems = require("./transactionItemModel");
const Customer = require("./customerModel");
const Address = require("./addressModel");
const Order = require("./orderModel");
const OrderItem = require("./orderItemModel");
const Cart = require("./cartModel");
const CartItem = require("./cartItemModel");
const ProductImage = require("./productImageModel");
const Comment = require("./commentModel");
const CommentImage = require("./commentImageModel");
const Admin = require("./adminModel");
const AuditLog = require("./auditLog");

// Transactions
TransactionHistories.hasMany(TransactionItems, {
  foreignKey: "transactionId",
});
TransactionItems.belongsTo(TransactionHistories, {
  foreignKey: "transactionId",
});
TransactionItems.belongsTo(Product, {
  foreignKey: "productId",
});

// Customers and Addresses
Customer.hasMany(Address, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
});
Address.belongsTo(Customer, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
});

// Orders and Order Items
Customer.hasMany(Order, { foreignKey: "customerId", onDelete: "CASCADE" });
Order.belongsTo(Customer, { foreignKey: "customerId" });

Address.hasMany(Order, { foreignKey: "addressId", onDelete: "CASCADE" });
Order.belongsTo(Address, { foreignKey: "addressId" });

Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

// Cart and Cart Items
Customer.hasMany(Cart, { foreignKey: "customerId", onDelete: "CASCADE" });
Cart.belongsTo(Customer, { foreignKey: "customerId" });

Cart.hasMany(CartItem, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasMany(CartItem, { foreignKey: "productId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId" });

// Product and ProductImage
Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "images",
  onDelete: "CASCADE",
});
ProductImage.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

// Comments and Comment Images
Customer.hasMany(Comment, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
});
Comment.belongsTo(Customer, {
  foreignKey: "customerId",
});

Product.hasMany(Comment, {
  foreignKey: "productId",
  onDelete: "CASCADE",
});
Comment.belongsTo(Product, {
  foreignKey: "productId",
});

Comment.hasMany(CommentImage, {
  foreignKey: "commentId",
  as: "images",
  onDelete: "CASCADE",
});
CommentImage.belongsTo(Comment, {
  foreignKey: "commentId",
  as: "comment",
});

// Admin and AuditLog
Admin.hasMany(AuditLog, {
  foreignKey: "adminId",
  as: "auditLogs",
  onDelete: "CASCADE",
});
AuditLog.belongsTo(Admin, {
  foreignKey: "adminId",
  as: "admin",
});

module.exports = {
  Product,
  PendingStock,
  TransactionHistories,
  TransactionItems,
  Customer,
  Address,
  Order,
  OrderItem,
  Cart,
  CartItem,
  ProductImage,
  Comment,
  CommentImage,
  sequelize,
};
