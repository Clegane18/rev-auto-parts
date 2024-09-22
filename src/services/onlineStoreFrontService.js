const {
  Product,
  TransactionItems,
  TransactionHistories,
  ProductImage,
} = require("../database/models/index");
const { getMonthStartAndEnd } = require("../utils/dateUtils");
const path = require("path");
const fs = require("fs");
const { Op, col, fn } = require("sequelize");
const nodemailer = require("nodemailer");
const { log } = require("console");
require("dotenv").config();

const uploadProductImages = async ({ productId, files }) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw {
        status: 404,
        data: { message: `Product with ID ${productId} not found.` },
      };
    }

    if (!files || files.length === 0) {
      throw {
        status: 400,
        data: { message: "No files uploaded" },
      };
    }

    const imagePaths = [];

    for (const file of files) {
      const productName = product.name.replace(/\s+/g, "_").toLowerCase();
      const extname = path.extname(file.originalname);
      const timestamp = Date.now();
      const newFilename = `${productName}_${productId}_${timestamp}${extname}`;

      const oldPath = path.join("uploads", file.filename);
      const newPath = path.join("uploads", newFilename);

      fs.renameSync(oldPath, newPath);

      const imageUrl = newPath.replace(/\\/g, "/");

      await ProductImage.create({
        imageUrl: imageUrl,
        productId: productId,
        isPrimary: false,
      });

      imagePaths.push(imageUrl);
    }

    await Product.update({ status: "ready" }, { where: { id: productId } });

    return {
      status: 200,
      data: {
        message: "Product photos uploaded successfully",
        imageUrls: imagePaths,
      },
    };
  } catch (error) {
    console.error("Error in uploadProductImages service:", error);
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
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["imageUrl"],
          where: { isPrimary: true },
          required: false,
        },
      ],
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

const getBestSellingProductsForMonth = async (limit = 5) => {
  const { start, end } = getMonthStartAndEnd();

  try {
    const result = await TransactionItems.findAll({
      attributes: [
        [col("Product.id"), "id"],
        [col("Product.name"), "productName"],
        [col("Product.description"), "description"],
        [col("Product.price"), "price"],
        [col("Product.images.imageUrl"), "imageUrl"],
        [col("Product.stock"), "stock"],
        [fn("SUM", col("TransactionItems.quantity")), "totalSold"],
      ],
      include: [
        {
          model: Product,
          as: "Product",
          attributes: [],
          where: {
            status: "published",
          },
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: [],
              where: { isPrimary: true },
              required: false,
            },
          ],
        },
        {
          model: TransactionHistories,
          as: "TransactionHistory",
          attributes: [],
          required: true,
          where: {
            transactionDate: {
              [Op.between]: [start, end],
            },
            transactionStatus: "completed",
            salesLocation: "online",
          },
        },
      ],
      where: {},
      group: [
        "TransactionItems.productId",
        "Product.id",
        "Product.name",
        "Product.description",
        "Product.price",
        "Product.images.imageUrl",
        "Product.stock",
      ],
      order: [[fn("SUM", col("TransactionItems.quantity")), "DESC"]],
      limit: limit,
      raw: true,
      subQuery: false,
    });

    if (result.length > 0) {
      return {
        status: 200,
        message: "Top best seller items fetched successfully",
        data: result,
      };
    } else {
      return {
        status: 404,
        message: "No items found",
        data: [],
      };
    }
  } catch (error) {
    console.error("Error in getBestSellingProductsForMonth service:", error);
    throw error;
  }
};

const getAllCategoriesInOnlineStoreFront = async () => {
  try {
    const products = await Product.findAll({
      where: {
        status: "published",
      },
      attributes: ["category"],
      group: ["category"],
    });

    const categories = products.map((product) => product.category);
    const sortedCategories = categories.sort();

    return {
      status: 200,
      message: "Successfully fetched all categories.",
      categories: sortedCategories,
    };
  } catch (error) {
    console.error(
      "Error in getAllCategoriesInOnlineStoreFront service:",
      error
    );
    throw error;
  }
};

const sendContactUsEmail = async ({ name, email, phone, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: `
        You have a new contact request:
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      message: "Email successfully sent!",
    };
  } catch (error) {
    console.error("Error in sendContactUsEmail service:", error);
    throw error;
  }
};

const updateProductPurchaseMethod = async ({
  productId,
  newPurchaseMethod,
}) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return {
        status: 404,
        message: `The product with the ID of ${productId} was not found`,
      };
    }

    if (!["delivery", "in-store-pickup"].includes(newPurchaseMethod)) {
      return {
        status: 400,
        message: `Invalid purchase method: ${newPurchaseMethod}. Valid options are "delivery" or "in-store-pickup".`,
      };
    }

    product.purchaseMethod = newPurchaseMethod;
    await product.save();

    return {
      status: 200,
      message: `Purchase method for product ID ${productId} successfully updated to ${newPurchaseMethod}`,
      product: product,
    };
  } catch (error) {
    console.error("Error in updateProductPurchaseMethod service:", error);
    throw {
      status: 500,
      message: "An error occurred while updating the purchase method",
      data: error.message,
    };
  }
};

const deleteProductImageById = async ({ productImageId }) => {
  try {
    const productImage = await ProductImage.findByPk(productImageId);

    if (!productImage) {
      throw {
        status: 404,
        data: {
          message: `Product photo with ID ${productImageId} was not found.`,
        },
      };
    }

    if (productImage.isPrimary === true) {
      throw {
        status: 400,
        data: { message: "Cannot delete a primary product photo." },
      };
    }

    await productImage.destroy();

    return {
      status: 200,
      message: `Product photo with ID ${productImageId} deleted successfully.`,
    };
  } catch (error) {
    console.error("Error in deleteProductImageById service:", error);
    if (error.status && error.data && error.data.message) {
      throw error;
    }
    throw {
      status: 500,
      data: { message: "An error occurred while deleting the product image." },
    };
  }
};

const changePrimaryProductImageById = async ({ productImageId }) => {
  try {
    const productImage = await ProductImage.findByPk(productImageId);

    if (!productImage) {
      throw {
        status: 404,
        data: {
          message: `Product photo with ID ${productImageId} was not found.`,
        },
      };
    }

    if (productImage.isPrimary === true) {
      return {
        status: 200,
        message: `Product photo with ID ${productImageId} is already the primary image.`,
      };
    }

    await ProductImage.sequelize.transaction(async (transaction) => {
      await ProductImage.update(
        { isPrimary: false },
        {
          where: {
            productId: productImage.productId,
            isPrimary: true,
          },
          transaction,
        }
      );

      productImage.isPrimary = true;
      await productImage.save({ transaction });
    });

    return {
      status: 200,
      message: `Product photo with ID ${productImageId} has been set as the primary image.`,
    };
  } catch (error) {
    console.error("Error in changePrimaryProductImageById service:", error);

    if (error.status && error.data) {
      throw error;
    } else {
      throw {
        status: 500,
        message: "An error occurred while changing the primary product image.",
        data: error.message,
      };
    }
  }
};

const getAllProductImagesByProductId = async ({ productId }) => {
  try {
    const product = await Product.findByPk(productId, {
      include: {
        model: ProductImage,
        as: "images",
        attributes: ["id", "imageUrl", "isPrimary", "createdAt", "updatedAt"],
      },
    });

    if (!product) {
      throw {
        status: 404,
        data: {
          message: `Product with ID ${productId} was not found.`,
        },
      };
    }

    const images = product.images;

    return {
      status: 200,
      data: images,
    };
  } catch (error) {
    console.error("Error in getAllProductImagesByProductId service:", error);

    if (error.status && error.data) {
      throw error;
    } else {
      throw {
        status: 500,
        message: "An error occurred while retrieving product images.",
        data: error.message || error,
      };
    }
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
};
