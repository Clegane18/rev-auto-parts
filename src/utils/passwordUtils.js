require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;
const dbPassword = process.env.DB_PASSWORD;
const dbUserName = process.env.DB_USERNAME;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const adminUsername = process.env.ADMIN_USERNAME;
let adminPassword = process.env.ADMIN_PASSWORD;
const superAdminUserName = process.env.SUPER_ADMIN_USERNAME;
let superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

module.exports = {
  dbPassword,
  dbUserName,
  dbName,
  dbHost,
  adminUsername,
  adminPassword,
  secretKey,
  superAdminUserName,
  superAdminPassword,
};
