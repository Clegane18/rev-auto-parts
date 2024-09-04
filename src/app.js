require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./database/db");
const inventoryRoutes = require("./routes/inventoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const onlineStoreFrontRoutes = require("./routes/onlineStoreFrontRoutes");
const locationRoutes = require("./routes/locationRoutes");
const onlineStoreFrontCustomerRoutes = require("./routes/onlineStoreFrontCustomerRoutes");
const passport = require("./services/authService");
const authRoutes = require("./routes/authRoutes");
const addressRoutes = require("./routes/addressRoutes");
const archiveRoutes = require("./routes/archiveRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bodyParser = require("body-parser");
const session = require("express-session");

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
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/online-store-front", onlineStoreFrontRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/customer", onlineStoreFrontCustomerRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/archives", archiveRoutes);
app.use("/api/order", orderRoutes);

module.exports = app;
