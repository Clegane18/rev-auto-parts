const onlineStoreFrontService = require("../services/onlineStoreFrontService");

const uploadProductPhotos = async (req, res) => {
  try {
    const result = await onlineStoreFrontService.uploadProductPhotos({
      productId: req.params.productId,
      productPhotos: req.files,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error uploading product photos:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = { uploadProductPhotos };
