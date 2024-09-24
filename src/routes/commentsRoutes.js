const express = require("express");
const router = express.Router();
const { checkAuthorization } = require("../utils/tokenUtils");
const { authenticateToken } = require("../middlewares/jwtMiddleware");
const commentsController = require("../controllers/commentsController");
const { commentUpload } = require("../middlewares/multerConfigComments");

router.post(
  "/products/:productId/comments",
  authenticateToken,
  checkAuthorization,
  commentUpload.fields([{ name: "images", maxCount: 5 }]),
  commentsController.createComment
);

router.get(
  "/products/:productId/all-comments",
  commentsController.getAllComments
);

router.get(
  "/verify-purchase/:productId",
  authenticateToken,
  checkAuthorization,
  commentsController.verifyCustomerProductPurchase
);

module.exports = router;
