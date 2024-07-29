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

module.exports = { uploadProductImage };
