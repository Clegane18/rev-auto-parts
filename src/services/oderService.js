const Order = require("../database/models/orderModel");
const OrderItem = require("../database/models/orderItemModel");
const Product = require("../database/models/inventoryProductModel");
const Customer = require("../database/models/customerModel");
const Address = require("../database/models/addressModel");
const sequelize = require("../database/db");

const calculateShippingFee = async ({ addressId }) => {
  try {
    const address = await Address.findByPk(addressId);
    if (!address) {
      throw {
        status: 404,
        data: { message: "Address not found" },
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

    shippingFee = Math.round(shippingFee);

    return {
      status: 200,
      data: { shippingFee },
    };
  } catch (error) {
    console.error("Error in calculateShippingFee service:", error);
    throw error;
  }
};

const createOrder = async ({ customerId, addressId, items }) => {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw {
        status: 400,
        data: {
          message: "Invalid items provided. Items should be a non-empty array.",
        },
      };
    }

    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      throw {
        status: 404,
        data: {
          message: `Customer with the id of ${customerId} was not found.`,
        },
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
        throw {
          status: 404,
          data: { message: "Default address not found for customer" },
        };
      }

      addressId = defaultAddress.id;
    }

    const address = await Address.findOne({
      where: { id: addressId, customerId: customerId },
    });
    if (!address) {
      throw {
        status: 404,
        data: { message: "Address not found or does not belong to customer" },
      };
    }

    const {
      data: { shippingFee },
    } = await calculateShippingFee({ addressId });

    let totalAmount = 0;
    const productUpdates = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        throw {
          status: 404,
          data: { message: `Product with ID ${item.productId} not found` },
        };
      }

      if (product.stock < item.quantity) {
        throw {
          status: 400,
          data: { message: `Insufficient stock for product: ${product.name}` },
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
      message: "Order created successfully!",
      data: order,
    };
  } catch (error) {
    console.error("Error in createOrder service:", error);
    throw error;
  }
};

const getOrdersByStatus = async ({ status, customerId }) => {
  try {
    const whereClause = { customerId };
    if (status) {
      whereClause.status = status;
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["name", "imageUrl", "price"],
            },
          ],
        },
      ],
    });

    if (!orders || orders.length === 0) {
      return {
        status: 404,
        data: { message: `No orders found with status: ${status || "any"}` },
      };
    }

    const orderDetails = orders.map((order) => ({
      orderId: order.id,
      totalAmount: order.OrderItems.reduce(
        (total, item) => total + item.quantity * item.Product.price,
        0
      ),
      items: order.OrderItems.map((item) => ({
        productName: item.Product.name,
        productImage: item.Product.imageUrl,
        quantity: item.quantity,
      })),
    }));

    return {
      status: 200,
      message: `Orders retrieved successfully.`,
      data: orderDetails,
    };
  } catch (error) {
    console.error("Error in getOrdersByStatus service:", error);
    throw error;
  }
};

const cancelOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem }],
    });

    if (!order) {
      throw {
        status: 404,
        data: { message: `Order with ID ${orderId} not found` },
      };
    }

    if (order.status !== "To Pay") {
      throw {
        status: 400,
        data: { message: "Order cannot be canceled once it is processed." },
      };
    }

    await sequelize.transaction(async (t) => {
      for (const item of order.OrderItems) {
        const product = await Product.findByPk(item.productId, {
          transaction: t,
        });
        if (product) {
          await product.update(
            { stock: product.stock + item.quantity },
            { transaction: t }
          );
        }
      }

      await order.update({ status: "Cancelled" }, { transaction: t });
    });

    return {
      status: 200,
      message: "Order canceled successfully, and stock has been restored.",
    };
  } catch (error) {
    console.error("Error in cancelOrder service:", error);
    throw error;
  }
};

module.exports = {
  calculateShippingFee,
  createOrder,
  getOrdersByStatus,
  cancelOrder,
};
