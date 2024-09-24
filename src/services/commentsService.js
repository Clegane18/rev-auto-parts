const {
  Comment,
  CommentImage,
  Product,
  Customer,
  OrderItem,
  Order,
} = require("../database/models/index");
const sequelize = require("../database/db");
const path = require("path");

const createComment = async ({
  customerId,
  productId,
  rating,
  commentText,
  images,
}) => {
  const transaction = await sequelize.transaction();
  try {
    if (!customerId || !productId || !rating) {
      throw {
        status: 400,
        message: "customerId, productId, and rating are required.",
      };
    }

    if (rating < 1 || rating > 5) {
      throw {
        status: 400,
        message: "Rating must be between 1 and 5.",
      };
    }

    const imagesArray = images && images.images ? images.images : [];

    if (!commentText && imagesArray.length === 0) {
      throw {
        status: 400,
        message: "Either commentText or images must be provided.",
      };
    }

    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
      throw {
        status: 404,
        message: `Customer with ID ${customerId} not found.`,
      };
    }

    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      throw {
        status: 404,
        message: `Product with ID ${productId} not found.`,
      };
    }

    const orderItem = await OrderItem.findOne({
      include: [
        {
          model: Order,
          where: {
            customerId,
            status: "Completed",
          },
        },
      ],
      where: {
        productId,
      },
      transaction,
    });

    if (!orderItem) {
      throw {
        status: 403,
        message: "You can only comment on products you have purchased.",
      };
    }

    const comment = await Comment.create(
      {
        customerId,
        productId,
        rating,
        commentText: commentText || null,
      },
      { transaction }
    );

    if (imagesArray.length > 0) {
      const imageRecords = imagesArray.map((file) => ({
        commentId: comment.commentId,
        imageUrl: path.join("/uploads/commentsUpload", file.filename),
      }));
      await CommentImage.bulkCreate(imageRecords, { transaction });
    }

    await transaction.commit();

    return {
      status: 201,
      message: "Comment created successfully.",
      data: {
        commentId: comment.commentId,
        customerId: comment.customerId,
        productId: comment.productId,
        rating: comment.rating,
        commentText: comment.commentText,
        images:
          imagesArray.length > 0
            ? imagesArray.map((file) =>
                path.join("/uploads/commentsUpload", file.filename)
              )
            : [],
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error in createComment service:", error);
    throw error;
  }
};

const getAllComments = async ({ productId }) => {
  try {
    if (!productId) {
      return {
        status: 400,
        message: "Product ID is required.",
      };
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return {
        status: 404,
        message: `Product with ID ${productId} not found.`,
      };
    }

    const comments = await Comment.findAll({
      where: { productId },
      include: [
        {
          model: Customer,
          attributes: ["id", "username", "email"],
        },
        {
          model: CommentImage,
          as: "images",
          attributes: ["imageUrl"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedComments = comments.map((comment) => ({
      commentId: comment.commentId,
      customer: {
        id: comment.Customer.id,
        username: comment.Customer.username,
        email: comment.Customer.email,
      },
      rating: comment.rating,
      commentText: comment.commentText,
      images: comment.images.map((img) => img.imageUrl),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return {
      status: 200,
      message: "Comments fetched successfully.",
      data: formattedComments,
    };
  } catch (error) {
    console.error("Error in getComments service:", error);
    return {
      status: 500,
      message: "An error occurred while fetching comments.",
    };
  }
};

const verifyCustomerProductPurchase = async ({ customerId, productId }) => {
  try {
    if (!customerId || !productId) {
      return {
        status: 400,
        message: "Customer ID and Product ID are required.",
      };
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return {
        status: 404,
        message: `Product with ID ${productId} not found.`,
      };
    }

    const orderItem = await OrderItem.findOne({
      include: [
        {
          model: Order,
          where: {
            customerId,
            status: "Completed",
          },
        },
      ],
      where: {
        productId,
      },
    });

    if (!orderItem) {
      return {
        status: 200,
        message: "Customer has not purchased this product.",
        data: { hasPurchased: false },
      };
    }

    return {
      status: 200,
      message: "Customer has purchased this product.",
      data: { hasPurchased: true },
    };
  } catch (error) {
    console.error("Error in verifyCustomerProductPurchase service:", error);
    return {
      status: 500,
      message: "An error occurred while verifying the purchase.",
    };
  }
};

module.exports = {
  createComment,
  getAllComments,
  verifyCustomerProductPurchase,
};
