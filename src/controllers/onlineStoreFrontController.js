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

module.exports = {
  uploadProductImage,
  getProductByIdAndPublish,
  getPublishedItemsByCategory,
  unpublishItemByProductId,
};
