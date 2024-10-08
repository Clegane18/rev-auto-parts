const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Customer = require("./customerModel");

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: "id",
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barangay: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    label: {
      type: DataTypes.ENUM,
      values: ["Home", "Work"],
      allowNull: false,
      defaultValue: "Home",
    },
    isSetDefaultAddress: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isWithinMetroManila: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    distanceFromMetroManila: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Address;
