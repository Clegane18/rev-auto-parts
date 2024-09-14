const onlineStoreFrontService = require("../services/onlineStoreFrontService");

const uploadProductImage = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.uploadProductImage({
      productId: req.params.productId,
      file: req.file,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error uploading product photo:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getProductByIdAndPublish = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await onlineStoreFrontService.getProductByIdAndPublish(
      productId
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

module.exports = {
  uploadProductImage,
  getProductByIdAndPublish,
  getPublishedItemsByCategory,
  unpublishItemByProductId,
  getBestSellingProductsForMonth,
  getAllCategoriesInOnlineStoreFront,
  sendContactUsEmail,
};
