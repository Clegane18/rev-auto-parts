const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const errorHandler = require("../middlewares/errorHandler");
const { checkAuthorization } = require("../utils/tokenUtils");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const {
  createOrderValidation,
  getOrdersByStatusValidation,
} = require("../middlewares/validators");

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
  "/orders/status",
  getOrdersByStatusValidation,
  authenticateToken,
  checkAuthorization,
  orderController.getOrdersByStatus
);

router.get(
  "/orders/status/To-pay",
  authenticateToken,
  checkAuthorization,
  orderController.getToPayOrders
);

router.post(
  "/orders/:orderId/cancel",
  authenticateToken,
  checkAuthorization,
  orderController.cancelOrder
);

router.get("/orders", orderController.getAllOrders);

router.put("/orders/:orderId/update-status", orderController.updateOrderStatus);

router.use(errorHandler);
module.exports = router;
