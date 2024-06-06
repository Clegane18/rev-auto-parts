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
const returnProduct = async (req, res) => {
  try {
    const result = await transactionService.returnProduct({
      receiptNumber: req.params.receiptNumber,
      productIdToReturn: req.body.productIdToReturn,
      quantityToReturn: req.body.quantityToReturn,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "transactionController",
      "Error returning products."
    );
  }
};

module.exports = { buyProductsOnPhysicalStore, returnProduct };
