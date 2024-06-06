const { Sequelize, DataTypes } = require("sequelize");
const {
  dbPassword,
  dbUserName,
  dbName,
  dbHost,
} = require("../utils/passwordUtils");

module.exports = sequelize = new Sequelize(dbName, dbUserName, dbPassword, {
  host: dbHost,
  dialect: "postgres",
  timezone: "+08:00",
  logging: false,
  //Set the logging to true if need for debugging purposes
});
