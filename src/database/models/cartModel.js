const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "completed", "cancelled"),
    allowNull: false,
    defaultValue: "active",
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
});

module.exports = Cart;
