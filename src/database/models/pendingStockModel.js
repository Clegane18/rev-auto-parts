const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Product = require("./inventoryProductModel");

const PendingStock = sequelize.define(
  "PendingStock",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "name",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arrivalDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = PendingStock;
