const inventoryService = require("../services/inventoryService");
const controllerErrorHandlerUtils = require("../utils/controllerErrorHandlerUtils");

const addProduct = async (req, res) => {
  try {
    const result = await inventoryService.addProduct({
      category: req.body.category,
      itemCode: req.body.itemCode,
      brand: req.body.brand,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      supplierName: req.body.supplierName,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error creating new Product."
    );
  }
};

const addToProductStock = async (req, res) => {
  try {
    const result = await inventoryService.addToProductStock({
      productId: req.params.productId,
      quantityToAdd: req.body.quantityToAdd,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error adding new stocks."
    );
  }
};

const updateProductById = async (req, res) => {
  try {
    const result = await inventoryService.updateProductById({
      productId: req.params.productId,
      category: req.body.category,
      itemCode: req.body.itemCode,
      brand: req.body.brand,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      supplierName: req.body.supplierName,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error updating product by ID."
    );
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await inventoryService.getAllProducts();
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error retrieving all products."
    );
  }
};

const getProductById = async (req, res) => {
  try {
    const result = await inventoryService.getProductById({
      productId: req.params.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error retrieving product by ID."
    );
  }
};

const getProductByItemCode = async (req, res) => {
  try {
    const result = await inventoryService.getProductByItemCode({
      productItemCode: req.params.productItemCode,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error retrieving product by item code."
    );
  }
};

const getProductByBrand = async (req, res) => {
  try {
    const result = await inventoryService.getProductByBrand({
      productBrand: req.query.brand,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error retrieving product by brand."
    );
  }
};

const getProductByPriceRange = async (req, res) => {
  try {
    const result = await inventoryService.getProductByPriceRange({
      minPrice: parseFloat(req.query.minPrice),
      maxPrice: parseFloat(req.query.maxPrice),
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error retrieving product by price range."
    );
  }
};

const getProductByNameOrDescription = async (req, res) => {
  try {
    const result = await inventoryService.getProductByNameOrDescription({
      name: req.query.name,
      description: req.query.description,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error retrieving product by name or description."
    );
  }
};

const getProductsByDateRange = async (req, res) => {
  try {
    const result = await inventoryService.getProductsByDateRange({
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error retrieving product by date range."
    );
  }
};
const getLowStockProducts = async (req, res) => {
  try {
    const result = await inventoryService.getLowStockProducts();
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error retrieving low stock products."
    );
  }
};

const deleteProductById = async (req, res) => {
  try {
    const result = await inventoryService.deleteProductById({
      productId: req.params.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error deleting product."
    );
  }
};

const addPendingStock = async (req, res) => {
  try {
    const result = await inventoryService.addPendingStock({
      productId: req.body.productId,
      quantity: req.body.quantity,
      arrivalDate: req.body.arrivalDate,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error adding pending stock."
    );
  }
};

const confirmStock = async (req, res) => {
  try {
    const result = await inventoryService.confirmStock(req.params.id);
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error confirming stock."
    );
  }
};

const cancelPendingStock = async (req, res) => {
  try {
    const result = await inventoryService.cancelPendingStock(req.params.id);
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error canceling pending stock."
    );
  }
};

const getAllPendingStocks = async (req, res) => {
  try {
    const result = await inventoryService.getAllPendingStocks();
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error retrieving pending stocks."
    );
  }
};

const updateArrivalDate = async (req, res) => {
  try {
    const result = await inventoryService.updateArrivalDate({
      pendingStockId: req.params.id,
      newArrivalDate: req.body.newArrivalDate,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    return controllerErrorHandlerUtils(
      res,
      error,
      "inventoryController",
      "Error updating arrival date."
    );
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductByItemCode,
  getProductByBrand,
  getProductByPriceRange,
  getProductByNameOrDescription,
  getProductsByDateRange,
  getLowStockProducts,
  addToProductStock,
  getProductById,
  updateProductById,
  deleteProductById,
  addPendingStock,
  confirmStock,
  cancelPendingStock,
  getAllPendingStocks,
  updateArrivalDate,
};
