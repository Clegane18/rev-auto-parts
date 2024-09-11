const Cart = require("../database/models/cartModel");
const CartItem = require("../database/models/cartItemModel");
const Product = require("../database/models/inventoryProductModel");

const addProductToCart = async ({ customerId, productId }) => {
  try {
    let cart = await Cart.findOne({
      where: {
        customerId,
        status: "active",
      },
    });

    if (!cart) {
      cart = await Cart.create({
        customerId,
        status: "active",
        totalAmount: 0.0,
      });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      throw {
        status: 404,
        data: { message: `Product not found with ID: ${productId}` },
      };
    }

    const cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (cartItem) {
      cartItem.quantity += 1;
      cartItem.subtotal = cartItem.quantity * product.price;
      await cartItem.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId,
        quantity: 1,
        subtotal: product.price,
      });
    }

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
    });

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0
    );

    cart.totalAmount = totalAmount;
    await cart.save();

    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: [CartItem],
    });

    return {
      status: 200,
      message: "Product added to cart successfully",
      data: updatedCart,
    };
  } catch (error) {
    console.error("Error in addProductToCart service:", error);
    throw error;
  }
};

const getCartItems = async ({ customerId }) => {
  try {
    const cart = await Cart.findOne({
      where: { customerId, status: "active" },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "imageUrl", "stock"],
            },
          ],
        },
      ],
    });

    if (!cart) {
      throw {
        status: 404,
        data: { message: "Cart not found for the specified customer." },
      };
    }

    return {
      status: 200,
      data: cart,
    };
  } catch (error) {
    console.error("Error in getCartItems service:", error);
    throw error;
  }
};

const removeProductFromCart = async ({ customerId, productId }) => {
  try {
    const cart = await Cart.findOne({
      where: { customerId, status: "active" },
    });

    if (!cart) {
      throw {
        status: 404,
        data: { message: "Active cart not found for the specified customer." },
      };
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!cartItem) {
      throw {
        status: 404,
        data: {
          message: `Product with ID ${productId} not found in the cart.`,
        },
      };
    }

    await cartItem.destroy();

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
    });

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0
    );

    cart.totalAmount = totalAmount;
    await cart.save();

    return {
      status: 200,
      message: `Product with ID ${productId} removed from the cart successfully.`,
    };
  } catch (error) {
    console.error("Error in removeProductFromCart service:", error);
    throw error;
  }
};

const updateCartItemQuantity = async ({
  customerId,
  productId,
  action,
  value,
}) => {
  try {
    const cart = await Cart.findOne({
      where: { customerId, status: "active" },
      include: [
        {
          model: CartItem,
          include: [Product],
        },
      ],
    });

    if (!cart) {
      throw {
        status: 404,
        data: { message: "Active cart not found for the specified customer." },
      };
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
      include: [Product],
    });

    if (!cartItem) {
      throw {
        status: 404,
        data: {
          message: `Product with ID ${productId} not found in the cart.`,
        },
      };
    }

    let newQuantity;
    if (action === "increaseQuantity") {
      newQuantity = cartItem.quantity + value;
    } else if (action === "decreaseQuantity") {
      newQuantity = cartItem.quantity - value;
    } else {
      throw {
        status: 400,
        data: {
          message:
            "Invalid action. Use 'increaseQuantity' or 'decreaseQuantity'.",
        },
      };
    }

    if (newQuantity <= 0) {
      await cartItem.destroy();

      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
      });

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.subtotal),
        0
      );

      cart.totalAmount = totalAmount;
      await cart.save();

      return {
        status: 200,
        message: `Product with ID ${productId} removed from the cart.`,
        data: cart,
      };
    }

    const productPrice = parseFloat(cartItem.Product.price);
    if (isNaN(productPrice)) {
      throw {
        status: 500,
        data: { message: `Invalid product price for product ID ${productId}.` },
      };
    }

    cartItem.quantity = newQuantity;

    if (isNaN(cartItem.quantity)) {
      throw {
        status: 500,
        data: { message: "Calculated quantity is invalid." },
      };
    }

    cartItem.subtotal = cartItem.quantity * productPrice;

    if (isNaN(cartItem.subtotal)) {
      throw {
        status: 500,
        data: { message: "Calculated subtotal is invalid." },
      };
    }

    await cartItem.save();

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
    });

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0
    );

    if (isNaN(totalAmount)) {
      throw {
        status: 500,
        data: { message: "Calculated total amount is invalid." },
      };
    }

    cart.totalAmount = totalAmount;
    await cart.save();

    return {
      status: 200,
      message: `Quantity of product with ID ${productId} updated successfully.`,
      data: cart,
    };
  } catch (error) {
    console.error("Error in updateCartItemQuantity service:", error);
    throw error;
  }
};

const getCartItemCount = async ({ customerId }) => {
  try {
    const cart = await Cart.findOne({
      where: { customerId, status: "active" },
      include: [
        {
          model: CartItem,
          attributes: ["quantity"],
        },
      ],
    });

    if (!cart) {
      throw {
        status: 404,
        data: { message: "Active cart not found for the specified customer." },
      };
    }

    const totalQuantity = cart.CartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    return {
      status: 200,
      data: totalQuantity,
    };
  } catch (error) {
    console.error("Error in getCartItemCount service:", error);
    throw error;
  }
};

module.exports = {
  addProductToCart,
  getCartItems,
  removeProductFromCart,
  updateCartItemQuantity,
  getCartItemCount,
};
