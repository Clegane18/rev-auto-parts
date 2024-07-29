const { Product } = require("../database/models");
const path = require("path");
const fs = require("fs");

const uploadProductImage = async ({ productId, file }) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw {
        status: 404,
        data: { message: `Product with ID ${productId} not found.` },
      };
    }

    if (!file) {
      throw {
        status: 400,
        data: { message: "No file uploaded" },
      };
    }

    const productName = product.name.replace(/\s+/g, "_").toLowerCase();
    const extname = path.extname(file.originalname);
    const timestamp = Date.now();
    const newFilename = `${productName}_${productId}_${timestamp}${extname}`;

    const oldPath = path.join("uploads", file.filename);
    const newPath = path.join("uploads", newFilename);

    fs.renameSync(oldPath, newPath);

    const imageUrl = path.join("uploads", newFilename);
    await Product.update({ imageUrl: imageUrl }, { where: { id: productId } });

    return {
      status: 200,
      data: {
        message: "Product photo uploaded successfully",
        imageUrl: imageUrl,
      },
    };
  } catch (error) {
    console.error("Error in uploadProductImage service:", error);
    throw error;
  }
};

module.exports = { uploadProductImage };
