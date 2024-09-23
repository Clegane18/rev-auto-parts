const commentsService = require("../services/commentsService");

const createComment = async (req, res) => {
  try {
    const result = await commentsService.createComment({
      customerId: req.user.id,
      productId: req.params.productId,
      rating: req.body.rating,
      commentText: req.body.commentText,
      images: req.files,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error creating comments:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getAllComments = async (req, res) => {
  try {
    const result = await commentsService.getAllComments({
      productId: req.params.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching all comments:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = { createComment, getAllComments };
