const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const errorHandler = require("../middlewares/errorHandler");
const { checkAuthorization } = require("../utils/tokenUtils");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const { createOrderValidation } = require("../middlewares/validators");

router.post(
  "/calculate-shipping-fee/:addressId",
  authenticateToken,
  checkAuthorization,
  orderController.calculateShippingFee
);

router.post(
  "/create-order/:addressId",
  authenticateToken,
  createOrderValidation,
  checkAuthorization,
  orderController.createOrder
);

router.get(
  "/orders/order-status",
  authenticateToken,
  checkAuthorization,
  orderController.getOrdersByStatus
);

router.post("/orders/:orderId/cancel", orderController.cancelOrder);

router.use(errorHandler);
module.exports = router;
