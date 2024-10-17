const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Customer = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    changePasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    changePasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^(\+63)[0-9]{10}$/,
      },
    },
    gender: {
      type: DataTypes.ENUM,
      values: ["Male", "Female", "Other"],
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    accountStatus: {
      type: DataTypes.ENUM,
      values: ["Active", "Suspended"],
      allowNull: false,
      defaultValue: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { Customer };
