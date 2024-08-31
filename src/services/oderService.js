const Order = require("../database/models/orderModel");
const OrderItem = require("../database/models/orderItemModel");
const Product = require("../database/models/inventoryProductModel");
const Customer = require("../database/models/customerModel");
const Address = require("../database/models/addressModel");

const createOrder = async ({ customerId, addressId, items }) => {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        status: 400,
        message: "Invalid items provided. Items should be a non-empty array.",
      };
    }

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return {
        status: 404,
        data: `Customer with the id of ${customerId} was not found.`,
      };
    }

    if (!addressId) {
      const defaultAddress = await Address.findOne({
        where: {
          customerId: customerId,
          isSetDefaultAddress: true,
        },
      });

      if (!defaultAddress) {
        return {
          status: 404,
          message: "Default address not found for customer",
        };
      }

      addressId = defaultAddress.id;
    }

    const address = await Address.findOne({
      where: { id: addressId, customerId: customerId },
    });
    if (!address) {
      return {
        status: 404,
        message: "Address not found or does not belong to customer",
      };
    }

    let shippingFee = 0;
    if (address.isWithinMetroManila) {
      shippingFee = 0;
    } else {
      const baseShippingFee = 50;
      const pricePerKm = 5;
      const distance = address.distanceFromMetroManila || 0;
      shippingFee = pricePerKm * distance + baseShippingFee;
    }

    let totalAmount = 0;
    const productUpdates = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return {
          status: 404,
          message: `Product with ID ${item.productId} not found`,
        };
      }

      if (product.stock < item.quantity) {
        return {
          status: 400,
          message: `Insufficient stock for product: ${product.name}`,
        };
      }

      totalAmount += product.price * item.quantity;
      productUpdates.push({
        productId: item.productId,
        newStock: product.stock - item.quantity,
        price: product.price,
      });
    }

    totalAmount += shippingFee;

    const timestamp = Date.now();
    const orderNumber = `ORD-${customerId}-${timestamp}`;

    const order = await sequelize.transaction(async (t) => {
      const newOrder = await Order.create(
        {
          customerId,
          addressId,
          totalAmount,
          orderNumber,
          status: "To Pay",
          shippingFee,
        },
        { transaction: t }
      );

      for (const item of items) {
        const productUpdate = productUpdates.find(
          (p) => p.productId === item.productId
        );
        await OrderItem.create(
          {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: productUpdate.price,
          },
          { transaction: t }
        );

        await Product.update(
          { stock: productUpdate.newStock },
          { where: { id: item.productId }, transaction: t }
        );
      }

      return newOrder;
    });

    return {
      status: 200,
      message: "Order created successfully",
      order: order,
    };
  } catch (error) {
    console.error("Error in createOrder service:", error);
    throw { status: 500, message: "An unexpected error occurred" };
  }
};

module.exports = {
  createOrder,
};
