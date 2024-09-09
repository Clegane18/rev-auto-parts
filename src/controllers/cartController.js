const cartService = require("../services/cartService");

const addProductToCart = async (req, res) => {
  try {
    const result = await cartService.addProductToCart({
      customerId: req.user.id,
      productId: req.body.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getCartItems = async (req, res) => {
  try {
    const result = await cartService.getCartItems({
      customerId: req.user.id,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const result = await cartService.removeProductFromCart({
      customerId: req.user.id,
      productId: req.params.productId,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const { action, value } = req.body;

    const result = await cartService.updateCartItemQuantity({
      customerId: req.user.id,
      productId: req.params.productId,
      action,
      value: parseFloat(value) || 1,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

const getCartItemCount = async (req, res) => {
  try {
    const result = await cartService.getCartItemCount({
      customerId: req.user.id,
    });
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error fetching total count of items in the cart:", error);
    return res
      .status(error.status || 500)
      .json(error.data || { message: "An unexpected error occurred" });
  }
};

module.exports = {
  addProductToCart,
  getCartItems,
  removeProductFromCart,
  updateCartItemQuantity,
  getCartItemCount,
};
