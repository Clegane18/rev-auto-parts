const { getIoInstance } = require("../websocket");
const orderService = require("../services/orderService");

const calculateShippingFee = async (req, res) => {
  try {
    const result = await orderService.calculateShippingFee({
      addressId: req.params.addressId,
    });
    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error calculating shipping fee:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const createOrder = async (req, res) => {
  try {
    const result = await orderService.createOrder({
      customerId: req.user.id,
      addressId: parseInt(req.params.addressId, 10),
      items: req.body.items,
      paymentMethod: req.body.paymentMethod,
      gcashReferenceNumber: req.body.gcashReferenceNumber,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error creating order in online store:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const { status, customerId } = req.query;

    const result = await orderService.getOrdersByStatus({
      status,
      customerId,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

const getToPayOrders = async (req, res) => {
  try {
    const result = await orderService.getToPayOrders({
      customerId: req.user.id,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching 'To Pay' orders in online store:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const result = await orderService.cancelOrder({
      orderId: req.params.orderId,
      cancellationReason: req.body.cancellationReason,
    });
    res.status(result.status).json(result);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ error: error.data || "Internal Server Error" });
  }
};

const getCancellationCounts = async (req, res) => {
  try {
    const result = await orderService.getCancellationCounts({
      date: req.query.date,
    });
    res.status(result.status).json(result);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ error: error.data || "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const result = await orderService.getAllOrders();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all orders in online store:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const newStatus = req.body.newStatus;
    const adminId = req.user.id;

    const result = await orderService.updateOrderStatus({
      orderId,
      newStatus,
      adminId,
    });

    if (result.status === 200) {
      const io = getIoInstance();
      io.emit("orderStatusUpdated", { orderId, newStatus });
      console.log(`Order status updated and emitted for order ${orderId}`);
    }

    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(error.status || 500)
      .json({ error: error.data || "Internal Server Error" });
  }
};

const updateOrderETA = async (req, res) => {
  try {
    const result = await orderService.updateOrderETA({
      orderId: req.params.orderId,
      newETA: req.body.newETA,
      adminId: req.user.id,
    });
    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating order ETA:", error);
    res
      .status(error.status || 500)
      .json({ error: error.data || "Internal Server Error" });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const result = await orderService.deleteOrderById({
      orderId: req.params.orderId,
      adminId: req.user.id,
    });
    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting order by id:", error);
    res
      .status(error.status || 500)
      .json({ error: error.data || "Internal Server Error" });
  }
};

const updateOrderPaymentStatus = async (req, res) => {
  try {
    const result = await orderService.updateOrderPaymentStatus({
      orderId: req.params.orderId,
      newPaymentStatus: req.body.newPaymentStatus,
      adminId: req.user.id,
    });

    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating order payment status:", error);
    res
      .status(error.status || 500)
      .json({ error: error.data || "Internal Server Error" });
  }
};

const getAllOrdersByStatus = async (req, res) => {
  try {
    const result = await orderService.getAllOrdersByStatus({
      status: req.query.status,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all orders by status:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getAllOrdersByPaymentStatus = async (req, res) => {
  try {
    const result = await orderService.getAllOrdersByPaymentStatus({
      paymentStatus: req.query.paymentStatus,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all orders by payment status:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = {
  calculateShippingFee,
  createOrder,
  getOrdersByStatus,
  getToPayOrders,
  cancelOrder,
  getCancellationCounts,
  getAllOrders,
  updateOrderStatus,
  updateOrderETA,
  deleteOrderById,
  updateOrderPaymentStatus,
  getAllOrdersByStatus,
  getAllOrdersByPaymentStatus,
};
