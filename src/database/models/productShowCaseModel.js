const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ProductShowcase = sequelize.define(
  "ProductShowcase",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ProductShowcase;
