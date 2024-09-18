const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Customer = require("./customerModel");
const Address = require("./addressModel");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: "id",
      },
    },
    addressId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Address,
        key: "id",
      },
    },
    merchandiseSubtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["To Pay", "To Ship", "To Receive", "Completed", "Cancelled"],
      allowNull: false,
      defaultValue: "To Pay",
    },
    gcashReferenceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM,
      values: ["Cash on Delivery", "G-Cash"],
      allowNull: false,
      defaultValue: "Cash on Delivery",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Order;
