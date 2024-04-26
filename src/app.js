const express = require("express");
const sequelize = require("./database/db");
const inventoryRoutes = require("./routes/inventoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.json());

(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();

app.use("/api/auth", adminRoutes);
app.use("/api/auth", inventoryRoutes);
app.use("/api/auth/transactions", transactionRoutes);

app.get("/api/Jcas", (req, res) => {
  res.send("Welcome to Gear Track Inventory System");
});

module.exports = app;
