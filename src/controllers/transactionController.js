const transactionService = require("../services/transactionService");

const buyProductsOnPhysicalStore = async (req, res) => {
  try {
    const result = await transactionService.buyProductsOnPhysicalStore({
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      paymentAmount: req.body.paymentAmount,
    });
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error buying products on physical store:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = { buyProductsOnPhysicalStore };
