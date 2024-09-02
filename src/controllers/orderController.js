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
    const result = await orderService.getOrdersByStatus({
      status: req.query.status,
      customerId: req.user.id,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching orders by status in online store:", error);
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

module.exports = {
  calculateShippingFee,
  createOrder,
  getOrdersByStatus,
  cancelOrder,
};
