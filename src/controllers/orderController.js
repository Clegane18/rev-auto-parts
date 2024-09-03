const orderService = require("../services/oderService");

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
    const orderId = req.params.orderId;
    const result = await orderService.cancelOrder(orderId);
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
    const result = await orderService.updateOrderStatus({
      orderId: req.params.orderId,
      newStatus: req.body.newStatus,
    });
    res.status(result.status).json(result);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ error: error.data || "Internal Server Error" });
  }
};

module.exports = {
  calculateShippingFee,
  createOrder,
  getOrdersByStatus,
  getToPayOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
