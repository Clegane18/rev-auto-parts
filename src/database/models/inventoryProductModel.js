const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  supplierCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  dateAdded: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  supplierName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("draft", "published", "ready"),
    allowNull: false,
    defaultValue: "draft",
  },
  purchaseMethod: {
    type: DataTypes.ENUM("delivery", "in-store-pickup"),
    allowNull: false,
    defaultValue: "delivery",
  },
});

module.exports = Product;
