const { Product } = require("../database/models");
const path = require("path");
const fs = require("fs");

const tempDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const uploadProductPhotos = async ({ productId, productPhotos }) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw {
        status: 404,
        data: {
          message: `Product with ID ${productId} not found.`,
        },
      };
    }

    if (productPhotos.length > 5) {
      throw {
        status: 400,
        data: {
          message: "You can only upload up to 5 photos.",
        },
      };
    }

    const uploadedFiles = [];
    for (const productPhoto of productPhotos) {
      const productName = product.name
        .replace(/[^a-zA-Z0-9]/g, "_")
        .substring(0, 20);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const newFilename = `${productName}-${productId}-${uniqueSuffix}${path.extname(
        productPhoto.originalname
      )}`;
      const tempFilePath = path.join(tempDir, newFilename);

      fs.renameSync(productPhoto.path, tempFilePath);

      uploadedFiles.push({
        newFilename,
      });
    }

    return {
      status: 200,
      data: {
        message: "Product photos uploaded successfully",
        files: uploadedFiles,
      },
    };
  } catch (error) {
    console.error("Error in uploadProductPhotos service:", error);
    throw error;
  }
};

module.exports = { uploadProductPhotos };
