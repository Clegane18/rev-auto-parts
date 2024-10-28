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
      supplierCost: req.body.supplierCost,
      stock: req.body.stock,
      supplierName: req.body.supplierName,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error adding product:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
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
    console.error("Error adding product stock:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
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
      supplierCost: req.body.supplierCost,
      supplierName: req.body.supplierName,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating product by ID:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await inventoryService.getAllProducts();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getProductById = async (req, res) => {
  try {
    const result = await inventoryService.getProductById({
      productId: req.params.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getProductByItemCode = async (req, res) => {
  try {
    const result = await inventoryService.getProductByItemCode({
      productItemCode: req.query.productItemCode,
    });
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error fetching product by item code:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getProductByBrand = async (req, res) => {
  try {
    const result = await inventoryService.getProductByBrand({
      productBrand: req.query.brand,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching product by brand:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
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
    console.error("Error fetching product by price range:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
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
    console.error("Error fetching product by name or description:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
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
    console.error("Error fetching product by date range:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const result = await inventoryService.getLowStockProducts();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const addPendingStock = async (req, res) => {
  try {
    const result = await inventoryService.addPendingStock({
      productName: req.body.productName,
      quantity: req.body.quantity,
      arrivalDate: req.body.arrivalDate,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error adding pending stock:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const confirmStock = async (req, res) => {
  try {
    const result = await inventoryService.confirmStock(req.params.id);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error confirming stock:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const cancelPendingStock = async (req, res) => {
  try {
    const result = await inventoryService.cancelPendingStock(req.params.id);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error cancelling pending stock:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getAllPendingStocks = async (req, res) => {
  try {
    const result = await inventoryService.getAllPendingStocks();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all pending stocks:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
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
    console.error("Error updating arrival date:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getTopBestSellerItems = async (req, res) => {
  try {
    const result = await inventoryService.getTopBestSellerItems();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching top best seller items:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

const getTotalStock = async (req, res) => {
  try {
    const result = await inventoryService.getTotalStock();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching total number of stocks:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

const getTotalItems = async (req, res) => {
  try {
    const result = await inventoryService.getTotalItems();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching total number of items:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

const getAllItemsByCategory = async (req, res) => {
  try {
    const result = await inventoryService.getAllItemsByCategory();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all items by category:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

const getPublishedProducts = async (req, res) => {
  try {
    const result = await inventoryService.getPublishedProducts({
      name: req.query.name,
      description: req.query.description,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all items by category:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

const getAllProductsByStatus = async (req, res) => {
  try {
    const result = await inventoryService.getAllProductsByStatus({
      status: req.query.status,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all products by status:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
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
  addPendingStock,
  confirmStock,
  cancelPendingStock,
  getAllPendingStocks,
  updateArrivalDate,
  getTopBestSellerItems,
  getTotalStock,
  getTotalItems,
  getAllItemsByCategory,
  getPublishedProducts,
  getAllProductsByStatus,
};
