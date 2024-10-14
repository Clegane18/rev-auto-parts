const Order = require("../database/models/orderModel");
const OrderItem = require("../database/models/orderItemModel");
const Product = require("../database/models/inventoryProductModel");
const Customer = require("../database/models/customerModel");
const Address = require("../database/models/addressModel");
const CartItem = require("../database/models/cartItemModel");
const Cart = require("../database/models/cartModel");
const { ProductImage } = require("../database/models");
const sequelize = require("../database/db");
const {
  createOnlineTransactionHistory,
} = require("../utils/createOnlineTransactionHistory");
const {
  calculateETARange,
  formatDate,
  formatDateRange,
} = require("../utils/etaUtils");

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

const createOrder = async ({
  customerId,
  addressId,
  items,
  paymentMethod,
  gcashReferenceNumber,
}) => {
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
          message: `Customer with ID ${customerId} not found.`,
        },
      };
    }

    const cart = await Cart.findOne({
      where: {
        customerId,
        status: "active",
      },
    });

    if (!cart) {
      throw {
        status: 404,
        data: {
          message: `Active cart not found for customer with ID ${customerId}.`,
        },
      };
    }

    const address = await Address.findOne({
      where: { id: addressId, customerId: customerId },
    });
    if (!address) {
      throw {
        status: 404,
        data: {
          message: `Address with ID ${addressId} not found or doesn't belong to the customer.`,
        },
      };
    }

    const aggregatedItems = items.reduce((acc, item) => {
      if (acc[item.productId]) {
        acc[item.productId].quantity += item.quantity;
      } else {
        acc[item.productId] = { ...item };
      }
      return acc;
    }, {});

    const itemsArray = Object.values(aggregatedItems);

    const productUpdates = await Promise.all(
      itemsArray.map(async (item) => {
        const product = await Product.findByPk(item.productId, {
          include: [
            {
              model: ProductImage,
              as: "images",
              attributes: ["imageUrl"],
              where: { isPrimary: true },
              required: false,
            },
          ],
        });

        if (!product) {
          throw {
            status: 404,
            data: { message: `Product with ID ${item.productId} not found` },
          };
        }

        if (product.stock < item.quantity) {
          throw {
            status: 400,
            data: {
              message: `Insufficient stock for product: ${product.name}`,
            },
          };
        }

        const newStock = product.stock - item.quantity;

        await Product.update(
          { stock: newStock },
          { where: { id: product.id } }
        );

        return {
          productId: item.productId,
          newStock,
          price: product.price,
          quantity: item.quantity,
          imageUrl: product.images?.[0]?.imageUrl || "default-image.jpg",
        };
      })
    );

    const merchandiseSubtotal = productUpdates.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const {
      data: { shippingFee },
    } = await calculateShippingFee({ addressId });

    const totalAmount = merchandiseSubtotal + shippingFee;

    const orderNumber = `ORD-${customerId}-${Date.now()}`;

    const newOrder = await Order.create({
      customerId,
      addressId,
      merchandiseSubtotal,
      shippingFee,
      totalAmount,
      orderNumber,
      status: "To Pay",
      paymentMethod,
      gcashReferenceNumber:
        paymentMethod === "G-Cash" ? gcashReferenceNumber : null,
    });

    for (const productUpdate of productUpdates) {
      await OrderItem.create({
        orderId: newOrder.id,
        productId: productUpdate.productId,
        quantity: productUpdate.quantity,
        price: productUpdate.price,
        imageUrl: productUpdate.imageUrl,
      });
    }

    const purchasedProductIds = itemsArray.map((item) => item.productId);
    await CartItem.destroy({
      where: {
        productId: purchasedProductIds,
        cartId: cart.id,
      },
    });

    await createOnlineTransactionHistory({
      customerId,
      items: itemsArray,
      totalAmount,
    });

    return {
      status: 200,
      message: "Order created successfully",
      data: newOrder,
    };
  } catch (error) {
    console.error("Error in createOrder service:", error);
    throw error;
  }
};

const getOrdersByStatus = async ({ status, customerId }) => {
  try {
    const whereClause = { customerId };

    if (status && status !== "All") {
      whereClause.status = status;
    }

    const orders = await Order.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price"],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["imageUrl"],
                  where: { isPrimary: true },
                  required: false,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!orders || orders.length === 0) {
      return {
        status: 404,
        data: {
          message: "No Orders Yet",
        },
      };
    }

    const orderDetails = orders.map((order) => {
      const detail = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: formatDate(order.createdAt),
        items: order.OrderItems.map((item) => ({
          productId: item.Product.id,
          productName: item.Product.name,
          productImage:
            item.Product.images?.[0]?.imageUrl || "default-image.jpg",
          quantity: item.quantity,
          price: item.Product.price,
        })),
      };

      if (order.status === "To Ship") {
        const { startDate, endDate } = calculateETARange(order.createdAt);
        detail.eta = formatDateRange(startDate, endDate);
      }

      return detail;
    });

    return {
      status: 200,
      message: `Orders retrieved successfully.`,
      data: orderDetails,
    };
  } catch (error) {
    console.error("Error retrieving orders by status:", error);
    return {
      status: 500,
      data: {
        message: "An error occurred while retrieving orders.",
      },
    };
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

const getAllOrders = async () => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Customer,
          attributes: ["id", "username", "email", "phoneNumber"],
        },
        {
          model: Address,
          attributes: [
            "id",
            "fullName",
            "region",
            "province",
            "city",
            "barangay",
            "postalCode",
            "addressLine",
            "label",
            "isSetDefaultAddress",
          ],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "purchaseMethod"],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["imageUrl"],
                  where: { isPrimary: true },
                  required: false,
                },
              ],
            },
          ],
          attributes: ["id", "orderId", "productId", "quantity", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      throw {
        status: 404,
        data: {
          message: "No orders found",
        },
      };
    }

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        id: order.Customer.id,
        username: order.Customer.username,
        email: order.Customer.email,
        phoneNumber: order.Customer.phoneNumber,
      },
      address: {
        fullName: order.Address.fullName,
        region: order.Address.region,
        province: order.Address.province,
        city: order.Address.city,
        barangay: order.Address.barangay,
        postalCode: order.Address.postalCode,
        addressLine: order.Address.addressLine,
        label: order.Address.label,
        isSetDefaultAddress: order.Address.isSetDefaultAddress,
      },
      merchandiseSubtotal: order.merchandiseSubtotal,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      gcashReferenceNumber: order.gcashReferenceNumber,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      items: order.OrderItems.map((item) => ({
        productId: item.Product.id,
        productName: item.Product.name,
        quantity: item.quantity,
        price: item.price,
        purchaseMethod: item.Product.purchaseMethod,
        productImage: item.Product.images?.[0]?.imageUrl || "default-image.jpg",
      })),
    }));

    return {
      status: 200,
      message: "Orders retrieved successfully",
      data: formattedOrders,
    };
  } catch (error) {
    console.error("Error in getAllOrders service:", error);
    throw {
      status: error.status || 500,
      data: error.data || {
        message: "Internal server error while retrieving orders",
      },
    };
  }
};

const updateOrderStatus = async ({ orderId, newStatus }) => {
  try {
    const allowedStatuses = [
      "To Pay",
      "To Ship",
      "To Receive",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(newStatus)) {
      return {
        status: 400,
        data: {
          message:
            "Invalid status. Allowed statuses are: To Pay, To Ship, To Receive, Completed, Cancelled.",
        },
      };
    }

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem }],
    });

    if (!order) {
      return {
        status: 404,
        data: {
          message: "Order not found",
        },
      };
    }

    if (newStatus === "Cancelled") {
      if (order.status !== "To Pay") {
        return {
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
    } else {
      order.status = newStatus;
      await order.save();

      return {
        status: 200,
        message: `Order status updated to '${newStatus}' successfully`,
      };
    }
  } catch (error) {
    console.error("Error in updateOrderStatus service:", error);
    return {
      status: 500,
      data: {
        message: "An error occurred while updating the order status",
      },
    };
  }
};

const deleteOrderById = async ({ orderId }) => {
  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return {
        status: 404,
        data: {
          message: `Order with the id of ${orderId} not found`,
        },
      };
    }

    await order.destroy();

    return {
      status: 200,
      message: "Order deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteOrderById service:", error);
    return {
      status: 500,
      data: {
        message: "An error occurred while deleting the order",
      },
    };
  }
};

const updateOrderPaymentStatus = async ({ orderId, newPaymentStatus }) => {
  try {
    const allowedPaymentStatuses = ["Pending", "Paid"];

    if (!allowedPaymentStatuses.includes(newPaymentStatus)) {
      return {
        status: 400,
        data: {
          message:
            "Invalid payment status. Allowed statuses are: Pending, Paid.",
        },
      };
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return {
        status: 404,
        data: {
          message: "Order not found",
        },
      };
    }

    order.paymentStatus = newPaymentStatus;

    await order.save();

    return {
      status: 200,
      message: `Order payment status updated to '${newPaymentStatus}' successfully`,
    };
  } catch (error) {
    console.error("Error in updateOrderPaymentStatus service:", error);
    return {
      status: 500,
      data: {
        message: "An error occurred while updating the order payment status",
      },
    };
  }
};

const getAllOrdersByStatus = async ({ status }) => {
  try {
    if (!status) {
      throw {
        status: 400,
        data: {
          message: "Order status is required",
        },
      };
    }

    const orders = await Order.findAll({
      where: { status },
      include: [
        {
          model: Customer,
          attributes: ["id", "username", "email", "phoneNumber"],
        },
        {
          model: Address,
          attributes: [
            "id",
            "fullName",
            "region",
            "province",
            "city",
            "barangay",
            "postalCode",
            "addressLine",
            "label",
            "isSetDefaultAddress",
          ],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "purchaseMethod"],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["imageUrl"],
                  where: { isPrimary: true },
                  required: false,
                },
              ],
            },
          ],
          attributes: ["id", "orderId", "productId", "quantity", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      throw {
        status: 404,
        data: {
          message: `No orders found with status "${status}"`,
        },
      };
    }

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        id: order.Customer.id,
        username: order.Customer.username,
        email: order.Customer.email,
        phoneNumber: order.Customer.phoneNumber,
      },
      address: {
        fullName: order.Address.fullName,
        region: order.Address.region,
        province: order.Address.province,
        city: order.Address.city,
        barangay: order.Address.barangay,
        postalCode: order.Address.postalCode,
        addressLine: order.Address.addressLine,
        label: order.Address.label,
        isSetDefaultAddress: order.Address.isSetDefaultAddress,
      },
      merchandiseSubtotal: order.merchandiseSubtotal,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      gcashReferenceNumber: order.gcashReferenceNumber,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      items: order.OrderItems.map((item) => ({
        productId: item.Product.id,
        productName: item.Product.name,
        quantity: item.quantity,
        price: item.price,
        purchaseMethod: item.Product.purchaseMethod,
        productImage: item.Product.images?.[0]?.imageUrl || "default-image.jpg",
      })),
    }));

    return {
      status: 200,
      message: `Orders with status "${status}" retrieved successfully`,
      data: formattedOrders,
    };
  } catch (error) {
    console.error("Error in getOrdersByStatus service:", error);

    throw {
      status: error.status || 500,
      data: error.data || {
        message: "Internal server error while retrieving orders by status",
      },
    };
  }
};

const getAllOrdersByPaymentStatus = async ({ paymentStatus }) => {
  try {
    if (!paymentStatus) {
      throw {
        status: 400,
        data: {
          message: "Payment status is required",
        },
      };
    }

    const orders = await Order.findAll({
      where: { paymentStatus },
      include: [
        {
          model: Customer,
          attributes: ["id", "username", "email", "phoneNumber"],
        },
        {
          model: Address,
          attributes: [
            "id",
            "fullName",
            "region",
            "province",
            "city",
            "barangay",
            "postalCode",
            "addressLine",
            "label",
            "isSetDefaultAddress",
          ],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "purchaseMethod"],
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["imageUrl"],
                  where: { isPrimary: true },
                  required: false,
                },
              ],
            },
          ],
          attributes: ["id", "orderId", "productId", "quantity", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      throw {
        status: 404,
        data: {
          message: `No orders found with payment status "${paymentStatus}"`,
        },
      };
    }

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: {
        id: order.Customer.id,
        username: order.Customer.username,
        email: order.Customer.email,
        phoneNumber: order.Customer.phoneNumber,
      },
      address: {
        fullName: order.Address.fullName,
        region: order.Address.region,
        province: order.Address.province,
        city: order.Address.city,
        barangay: order.Address.barangay,
        postalCode: order.Address.postalCode,
        addressLine: order.Address.addressLine,
        label: order.Address.label,
        isSetDefaultAddress: order.Address.isSetDefaultAddress,
      },
      merchandiseSubtotal: order.merchandiseSubtotal,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      gcashReferenceNumber: order.gcashReferenceNumber,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      items: order.OrderItems.map((item) => ({
        productId: item.Product.id,
        productName: item.Product.name,
        quantity: item.quantity,
        price: item.price,
        purchaseMethod: item.Product.purchaseMethod,
        productImage: item.Product.images?.[0]?.imageUrl || "default-image.jpg",
      })),
    }));

    return {
      status: 200,
      message: `Orders with payment status "${paymentStatus}" retrieved successfully`,
      data: formattedOrders,
    };
  } catch (error) {
    console.error("Error in getAllOrdersByPaymentStatus service:", error);

    throw {
      status: error.status || 500,
      data: error.data || {
        message:
          "Internal server error while retrieving orders by payment status",
      },
    };
  }
};

module.exports = {
  calculateShippingFee,
  createOrder,
  getOrdersByStatus,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrderById,
  updateOrderPaymentStatus,
  getAllOrdersByStatus,
  getAllOrdersByPaymentStatus,
};
