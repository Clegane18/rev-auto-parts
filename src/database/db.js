const { Sequelize, DataTypes } = require("sequelize");
const {
  dbPassword,
  dbUserName,
  dbName,
  dbHost,
} = require("../utils/passwordUtils");

const sequelize = new Sequelize(dbName, dbUserName, dbPassword, {
  host: dbHost,
  dialect: "postgres",
  timezone: "+08:00",
  logging: false, // Set to true if needed for debugging purposes
});

module.exports = sequelize;
