const archiveService = require("../services/archiveService");

const archiveProductById = async (req, res) => {
  try {
    const result = await archiveService.archiveProductById({
      productId: req.params.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error archiving product by id:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

const getAllArchivedProducts = async (req, res) => {
  try {
    const result = await archiveService.getAllArchivedProducts();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all archived products:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const restoreArchivedProductsById = async (req, res) => {
  try {
    const result = await archiveService.restoreArchivedProductById({
      productId: req.params.productId,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error restoring archived product(s) by id(s):", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

const restoreMultipleArchivedProducts = async (req, res) => {
  try {
    const result = await archiveService.restoreMultipleArchivedProducts({
      productIds: req.body.productIds,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error restoring multiple archived products:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

const restoreAllArchivedProducts = async (req, res) => {
  try {
    const result = await archiveService.restoreAllArchivedProducts();

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error restoring all archived products:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

const permanentlyDeleteArchivedProduct = async (req, res) => {
  try {
    const result = await archiveService.permanentlyDeleteArchivedProduct({
      productId: req.params.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message || "An unexpected error occurred",
    });
  }
};

const deleteAllArchivedProducts = async (req, res) => {
  try {
    const result = await archiveService.deleteAllArchivedProducts();

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting all archived products:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

module.exports = {
  archiveProductById,
  restoreArchivedProductsById,
  getAllArchivedProducts,
  restoreMultipleArchivedProducts,
  restoreAllArchivedProducts,
  deleteAllArchivedProducts,
  permanentlyDeleteArchivedProduct,
};
