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

module.exports = {
  createComment,
  getAllComments,
};
