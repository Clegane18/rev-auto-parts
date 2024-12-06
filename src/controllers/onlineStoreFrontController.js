const onlineStoreFrontService = require("../services/onlineStoreFrontService");

const uploadProductImages = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.uploadProductImages({
      adminId: req.user.id,
      productId: req.params.productId,
      files: req.files,
    });

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error uploading product photos:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getProductByIdAndPublish = async (req, res) => {
  try {
    const { productId } = req.params;
    const adminId = req.user.id;
    const result = await onlineStoreFrontService.getProductByIdAndPublish(
      productId,
      adminId
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error publishing item by id:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getPublishedItemsByCategory = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.getPublishedItemsByCategory();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching published items by category:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const unpublishItemByProductId = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.unpublishItemByProductId({
      productId: req.params.productId,
      adminId: req.user.id,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error unpublishing items by id:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getBestSellingProductsForMonth = async (req, res) => {
  try {
    const result =
      await onlineStoreFrontService.getBestSellingProductsForMonth();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(
      "Error fetching best selling products for month in online store:",
      error
    );
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getAllCategoriesInOnlineStoreFront = async (req, res) => {
  try {
    const result =
      await onlineStoreFrontService.getAllCategoriesInOnlineStoreFront();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching categories in online store:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const sendContactUsEmail = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.sendContactUsEmail({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error sending email in contact us:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const updateProductPurchaseMethod = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.updateProductPurchaseMethod({
      productId: req.params.productId,
      newPurchaseMethod: req.body.newPurchaseMethod,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating product purchase method:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const deleteProductImageById = async (req, res) => {
  try {
    const productImageId = req.params.productImageId;
    const adminId = req.user.id;

    const result = await onlineStoreFrontService.deleteProductImageById(
      productImageId,
      adminId
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting product image:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const changePrimaryProductImageById = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.changePrimaryProductImageById({
      productImageId: req.params.productImageId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error changing primary product image:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getAllProductImagesByProductId = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.getAllProductImagesByProductId(
      {
        productId: req.params.productId,
      }
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all product images:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const uploadShowcaseImages = async (req, res) => {
  try {
    const adminId = req.user.id;
    const result = await onlineStoreFrontService.uploadShowcaseImages(
      req.files,
      adminId
    );

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error uploading showcase images:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getShowcaseImages = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.getShowcaseImages();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching showcase images:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const deleteShowcase = async (req, res) => {
  try {
    const showcaseId = req.params.showcaseId;
    const adminId = req.user.id;

    const result = await onlineStoreFrontService.deleteShowcase(
      showcaseId,
      adminId
    );
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting showcase images:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.getTopSellingProducts();
    return res.status(result.status).json(result);
  } catch (error) {
    console.error(
      "Error fetching top selling products for online store:",
      error
    );
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = {
  uploadProductImages,
  getProductByIdAndPublish,
  getPublishedItemsByCategory,
  unpublishItemByProductId,
  getBestSellingProductsForMonth,
  getAllCategoriesInOnlineStoreFront,
  sendContactUsEmail,
  updateProductPurchaseMethod,
  deleteProductImageById,
  changePrimaryProductImageById,
  getAllProductImagesByProductId,
  uploadShowcaseImages,
  getShowcaseImages,
  deleteShowcase,
  getTopSellingProducts,
};
