const inventoryService = require("../services/inventoryService");

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
    console.error("Error adding product:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
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
    console.error("Error adding product stock:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
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
    console.error("Error updating product by id:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await inventoryService.getAllProducts();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const result = await inventoryService.getProductById({
      productId: req.params.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching product by product id:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const getProductByItemCode = async (req, res) => {
  try {
    const result = await inventoryService.getProductByItemCode({
      productItemCode: req.params.productItemCode,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching product by item code:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const getProductByBrand = async (req, res) => {
  try {
    const result = await inventoryService.getProductByBrand({
      productBrand: req.query.brand,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching product by brand:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
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
    console.error("Error fetching product by price range:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const getProductByNameOrDescription = async (req, res) => {
  try {
    const result = await inventoryService.getProductByNameOrDescription({
      name: req.query.name,
      description: req.query.description,
    });
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error(
      "Error fetching product by name or description:",
      error.message
    );
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
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
    console.error("Error fetching product by date range:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};
const getLowStockProducts = async (req, res) => {
  try {
    const result = await inventoryService.getLowStockProducts();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching low stock products:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const result = await inventoryService.deleteProductById({
      productId: req.params.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting product:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
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
    console.error("Error adding pending stock:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const confirmStock = async (req, res) => {
  try {
    const result = await inventoryService.confirmStock(req.params.id);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error confirming stock:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const cancelPendingStock = async (req, res) => {
  try {
    const result = await inventoryService.cancelPendingStock(req.params.id);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error cancelling pending stock:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
};

const getAllPendingStocks = async (req, res) => {
  try {
    const result = await inventoryService.getAllPendingStocks();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all pending stocks:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
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
    console.error("Error updating arrival date:", error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
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
