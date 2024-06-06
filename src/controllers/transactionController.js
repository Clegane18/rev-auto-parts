const transactionService = require("../services/transactionService");
const controllerErrorHandlerUtils = require("../utils/controllerErrorHandlerUtils");

const buyProductsOnPhysicalStore = async (req, res) => {
  try {
    const result = await transactionService.buyProductsOnPhysicalStore({
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      paymentAmount: req.body.paymentAmount,
    });
    return res.status(result.status).json(result.data);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "buyProductsOnPhysicalStoreController",
      "Error processing purchase."
    );
  }
};

module.exports = { buyProductsOnPhysicalStore };
