const transactionService = require("../services/transactionService");
const controllerErrorHandlerUtils = require("../utils/controllerErrorHandlerUtils");

const buyProducts = async (req, res) => {
  try {
    const result = await transactionService.buyProducts({
      items: req.body.items,
      amountPaid: req.body.amountPaid,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "transactionController",
      "Error buying products."
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

module.exports = { buyProducts, returnProduct };
