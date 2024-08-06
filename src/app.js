const express = require("express");
const cors = require("cors");
const sequelize = require("./database/db");
const inventoryRoutes = require("./routes/inventoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const onlineStoreFrontRoutes = require("./routes/onlineStoreFrontRoutes");
const locationRoutes = require("./routes/locationRoutes");
const onlineStoreFrontCustomerRoutes = require("./routes/onlineStoreFrontCustomerRoutes");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
require("dotenv").config();
require("../config/passport");

const app = express();
app.use(bodyParser.json());
app.use(express.json());

(async () => {
  try {
    await sequelize.sync({ force: false, alter: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

app.use("/uploads", express.static("uploads"));

app.use("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api/auth", adminRoutes);
app.use("/api/auth", inventoryRoutes);
app.use("/api/auth/transactions", transactionRoutes);
app.use("/api/auth/online-store-front", onlineStoreFrontRoutes);
app.use("/api/auth/location", locationRoutes);
app.use("/api/auth/customer", onlineStoreFrontCustomerRoutes);
app.use("/auth", authRoutes);

module.exports = app;
