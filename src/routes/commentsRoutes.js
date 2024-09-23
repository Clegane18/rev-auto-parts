const express = require("express");
const router = express.Router();
const { checkAuthorization } = require("../utils/tokenUtils");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const commentsController = require("../controllers/commentsController");
const { createCommentValidation } = require("../middlewares/validators");
const { commentUpload } = require("../middlewares/multerConfigComments");

router.post(
  "/products/:productId/comments",
  authenticateToken,
  checkAuthorization,
  createCommentValidation,
  commentUpload.array("images", 5),
  commentsController.createComment
);

module.exports = router;
