const express = require("express");
const router = express.Router();
const errorHandler = require("../middlewares/errorHandler");
const cartController = require("../controllers/cartController");
const { checkAuthorization } = require("../utils/tokenUtils");
const { authenticateToken } = require("../middlewares/jwtMiddleware");

router.post(
  "/my-cart/add",
  authenticateToken,
  checkAuthorization,
  cartController.addProductToCart
);

router.get(
  "/my-cart",
  authenticateToken,
  checkAuthorization,
  cartController.getCartItems
);

router.delete(
  "/my-cart/remove/:productId",
  authenticateToken,
  checkAuthorization,
  cartController.removeProductFromCart
);

router.put(
  "/my-cart/update-quantity/:productId",
  authenticateToken,
  checkAuthorization,
  cartController.updateCartItemQuantity
);

router.get(
  "/my-cart/items-count",
  authenticateToken,
  checkAuthorization,
  cartController.getCartItemCount
);

router.use(errorHandler);
module.exports = router;
