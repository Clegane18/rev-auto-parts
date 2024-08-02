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

    const imageUrl = newPath.replace(/\\/g, "/");
    await Product.update(
      { imageUrl: imageUrl, status: "ready" },
      { where: { id: productId } }
    );

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

const getProductByIdAndPublish = async (productId) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return {
        status: 404,
        message: `The product with the ID of ${productId} was not found`,
      };
    }

    switch (product.status) {
      case "published":
        return {
          status: 400,
          message: `The product with the ID of ${productId} has already been published.`,
        };
      case "draft":
        return {
          status: 400,
          message: `The product with the ID of ${productId} doesn't have picture, Please upload picture before publishing`,
        };
      case "ready":
        product.status = "published";
        await product.save();
        return {
          status: 200,
          message: "Product successfully published",
          product: product,
        };
      default:
        return {
          status: 400,
          message: "Invalid product status",
        };
    }
  } catch (error) {
    console.error("Error in getProductByIdAndPublish service:", error);
    throw error;
  }
};

const getPublishedItemsByCategory = async () => {
  try {
    const products = await Product.findAll({
      where: {
        status: "published",
      },
    });

    const groupedProducts = products.reduce((acc, product) => {
      const category = product.category;

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(product);
      return acc;
    }, {});

    const sortedCategories = Object.keys(groupedProducts).sort();

    const sortedGroupedProducts = sortedCategories.reduce((acc, category) => {
      acc[category] = groupedProducts[category];
      return acc;
    }, {});

    return {
      status: 200,
      message: "Successfully fetched all published items by category.",
      groupedProducts: sortedGroupedProducts,
    };
  } catch (error) {
    console.error("Error in getPublishedItemsByCategory service:", error);
    throw error;
  }
};

const unpublishItemByProductId = async ({ productId }) => {
  try {
    const product = await Product.findOne({
      where: {
        id: productId,
        status: "published",
      },
    });

    if (!product) {
      return {
        status: 404,
        message: "Product not found or already unpublished.",
      };
    }

    product.status = "ready";
    await product.save();

    return {
      status: 200,
      message: "Successfully unpublished the product.",
      product: product,
    };
  } catch (error) {
    console.error("Error in unpublishItemByProductId service:", error);
    throw error;
  }
};

module.exports = {
  uploadProductImage,
  getProductByIdAndPublish,
  getPublishedItemsByCategory,
  unpublishItemByProductId,
};
