const {
  Comment,
  CommentImage,
  Product,
  Customer,
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
      return {
        status: 400,
        message: "customerId, productId, and rating are required.",
      };
    }

    if (rating < 1 || rating > 5) {
      return {
        status: 400,
        message: "Rating must be between 1 and 5.",
      };
    }

    if (!commentText && (!images || images.length === 0)) {
      return {
        status: 400,
        message: "Either commentText or images must be provided.",
      };
    }

    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
      return {
        status: 404,
        message: `Customer with ID ${customerId} not found.`,
      };
    }

    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      return {
        status: 404,
        message: `Product with ID ${productId} not found.`,
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

    if (images && images.length > 0) {
      const imageRecords = images.map((file) => ({
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
        images: images
          ? images.map((file) =>
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
    return {
      status: 500,
      message: "An error occurred while creating the comment.",
    };
  }
};

module.exports = {
  createComment,
};
