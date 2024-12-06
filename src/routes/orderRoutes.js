const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { checkAuthorization } = require("../utils/tokenUtils");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const {
  createOrderValidation,
  getOrdersByStatusValidation,
} = require("../middlewares/validators");
const auditLogger = require("../middlewares/auditLogger");

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

router.get(
  "/orders/cancel-reason-count",
  orderController.getCancellationCounts
);

router.get("/orders", orderController.getAllOrders);

router.put(
  "/orders/:orderId/update-status",
  authenticateToken,
  auditLogger((req) => `Updated order ${req.params.orderId} status`),
  orderController.updateOrderStatus
);

router.put(
  "/orders/:orderId/update-ETA",
  authenticateToken,
  auditLogger((req) => `Updated ETA for order ${req.params.orderId}`),
  orderController.updateOrderETA
);

router.delete(
  "/orders/:orderId",
  authenticateToken,
  auditLogger((req) => `Deleted order ${req.params.orderId}`),
  orderController.deleteOrderById
);

router.put(
  "/orders/:orderId/update-payment-status",
  authenticateToken,
  auditLogger(
    (req) => `Updated payment status for order ${req.params.orderId}`
  ),
  orderController.updateOrderPaymentStatus
);

router.get("/orders-list/status", orderController.getAllOrdersByStatus);

router.get(
  "/orders-list/payment-status",
  orderController.getAllOrdersByPaymentStatus
);

module.exports = router;
