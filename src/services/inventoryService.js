const Product = require("../database/models/inventoryProductModel");
const PendingStock = require("../database/models/pendingStockModel");
const TransactionItems = require("../database/models/transactionItemModel");
const TransactionHistories = require("../database/models/transactionHistoryModel");
const { Op, fn, col, literal } = require("sequelize");

const addProduct = async ({
  category,
  itemCode,
  brand,
  name,
  description,
  price,
  supplierCost,
  stock,
  supplierName,
}) => {
  try {
    const newProduct = await Product.create({
      category: category,
      itemCode: itemCode,
      brand: brand,
      name: name,
      description: description,
      price: price,
      supplierCost: supplierCost,
      stock: stock,
      supplierName: supplierName,
    });
    return {
      status: 200,
      message: "Product added successfully",
      product: newProduct,
    };
  } catch (error) {
    console.error("Error in addProduct service:", error);
    throw error;
  }
};

const addToProductStock = async ({ productId, quantityToAdd }) => {
  try {
    if (quantityToAdd === 0 || isNaN(quantityToAdd)) {
      throw {
        status: 400,
        data: {
          message: "Invalid quantity to add. Please provide a valid quantity.",
        },
      };
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      throw {
        status: 404,
        data: {
          message: `Product with ID ${productId} not found.`,
        },
      };
    }

    product.stock += quantityToAdd;

    await product.save();

    return {
      status: 200,
      message: `Stock for product with ID ${productId} updated successfully.`,
      updatedStockCount: product.stock,
      product: product,
    };
  } catch (error) {
    console.error("Error in addToProductStock service:", error);
    throw error;
  }
};

const updateProductById = async ({
  productId,
  category,
  itemCode,
  brand,
  name,
  description,
  price,
  supplierCost,
  stock,
  supplierName,
}) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw {
        status: 404,
        data: { message: `Product not found with ID: ${productId}` },
      };
    }

    const updates = {
      category,
      itemCode,
      brand,
      name,
      description,
      price,
      supplierCost,
      stock,
      supplierName,
    };

    let updated = false;

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && updates[key] !== "") {
        product[key] = updates[key];
        updated = true;
      }
    });

    if (!updated) {
      throw {
        status: 400,
        data: { message: "At least one piece of information must be updated." },
      };
    }

    await product.save();

    return {
      status: 200,
      message: `Product with ID ${productId} updated successfully.`,
      updatedProduct: product,
    };
  } catch (error) {
    console.error("Error in updateProductById service:", error);
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    const products = await Product.findAll({
      order: [["id", "ASC"]],
    });

    return {
      status: 200,
      data: products,
    };
  } catch (error) {
    console.error("Error in getAllProducts service:", error);
    throw error;
  }
};

const getProductById = async ({ productId }) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      throw {
        status: 404,
        data: {
          message: `Product with ID ${productId} not found.`,
        },
      };
    }

    return {
      status: 200,
      data: product,
    };
  } catch (error) {
    console.error("Error in getProductById service:", error);
    throw error;
  }
};

const getProductByItemCode = async ({ productItemCode }) => {
  try {
    const product = await Product.findOne({
      where: {
        itemCode: productItemCode,
      },
    });
    if (!product) {
      throw {
        status: 404,
        data: {
          message: `product not found with item code: ${productItemCode}`,
        },
      };
    }
    return {
      status: 200,
      data: product,
    };
  } catch (error) {
    console.error("Error in getProductByItemCode service:", error);
    throw error;
  }
};

const getProductByBrand = async ({ productBrand }) => {
  try {
    const products = await Product.findAll({
      where: {
        brand: {
          [Op.iLike]: `%${productBrand}%`,
        },
      },
    });

    if (!products || products.length === 0) {
      throw {
        status: 404,
        data: {
          message: `Product not found with brand: ${productBrand}`,
        },
      };
    }

    return {
      status: 200,
      data: products,
    };
  } catch (error) {
    console.error("Error in getProductByBrand service:", error);
    throw error;
  }
};

const getProductByPriceRange = async ({ minPrice, maxPrice }) => {
  try {
    if (!minPrice || !maxPrice) {
      throw {
        status: 400,
        data: { message: "Error: Both minPrice and maxPrice are required." },
      };
    }

    const products = await Product.findAll({
      where: {
        price: {
          [Op.between]: [minPrice, maxPrice],
        },
      },
      logging: console.log,
    });

    if (!products || products.length === 0) {
      throw {
        status: 404,
        data: {
          message: `Products not found within the price range: ${minPrice} - ${maxPrice}`,
        },
      };
    }
    return {
      status: 200,
      data: products,
    };
  } catch (error) {
    console.error("Error in getProductByPriceRange service:", error);
    throw error;
  }
};

const getProductByNameOrDescription = async ({ name, description }) => {
  try {
    if (!name && !description) {
      throw {
        status: 400,
        data: { message: "At least one of name or description is required." },
      };
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          name ? { name: { [Op.iLike]: `%${name}%` } } : null,
          description
            ? { description: { [Op.iLike]: `%${description}%` } }
            : null,
        ].filter(Boolean),
      },
    });

    if (!products || products.length === 0) {
      throw {
        status: 404,
        data: {
          message: `Product not found with name: ${
            name || "any"
          } and description: ${description || "any"}`,
        },
      };
    }

    return {
      status: 200,
      data: products,
    };
  } catch (error) {
    console.error("Error in getProductByNameOrDescription service:", error);
    throw error;
  }
};

const getProductsByDateRange = async ({ startDate, endDate }) => {
  try {
    if (!startDate || !endDate) {
      throw {
        status: 400,
        data: { messsage: "Error: Both startDate and endDate are required." },
      };
    }

    const start_date = new Date(startDate);
    const end_date = new Date(endDate);
    end_date.setHours(23, 59, 59, 999);

    if (isNaN(start_date.getTime()) || isNaN(end_date.getTime())) {
      throw {
        status: 400,
        data: {
          message: "Error: Invalid date format for startDate or endDate.",
        },
      };
    }

    const products = await Product.findAll({
      where: {
        dateAdded: {
          [Op.between]: [start_date, end_date],
        },
      },
    });

    if (!products || products.length === 0) {
      throw {
        status: 404,
        data: {
          message: `Products not found within the date range: ${startDate} - ${endDate}`,
        },
      };
    }
    return {
      status: 200,
      data: products,
    };
  } catch (error) {
    console.error("Error in getProductsByDateRange service:", error);
    throw error;
  }
};

const getLowStockProducts = async () => {
  try {
    const products = await Product.findAll();
    const minimumStockLevel = 15;
    const lowStockProducts = products.filter(
      (product) => product.stock < minimumStockLevel
    );

    if (lowStockProducts.length === 0) {
      return {
        status: 200,
        data: { message: "No products are currently low in stock." },
      };
    }

    return {
      status: 200,
      data: lowStockProducts,
    };
  } catch (error) {
    console.error("Error in getLowStockProducts service:", error);
    throw error;
  }
};

const deleteProductById = async ({ productId }) => {
  try {
    const id = parseInt(productId, 10);
    const product = await Product.findByPk(id);

    if (!product) {
      throw {
        status: 404,
        message: `Product not found with ID: ${id}`,
      };
    }

    const pendingStocks = await PendingStock.findAll({
      where: { productId: id },
    });

    const hasPendingStatus = pendingStocks.some(
      (stock) => stock.status === "pending"
    );

    if (hasPendingStatus) {
      throw {
        status: 400,
        message: `Cannot delete product with ID ${id} because it has incoming pending stock.`,
      };
    }

    await PendingStock.destroy({
      where: { productId: id, status: { [Op.not]: "pending" } },
    });

    await product.destroy();

    return {
      status: 200,
      message: `Product with ID ${id} successfully deleted from the inventory.`,
    };
  } catch (error) {
    console.error("Error in deleteProductById service:", error);
    throw error;
  }
};

const addPendingStock = async ({ productId, quantity, arrivalDate }) => {
  try {
    const newPendingStock = await PendingStock.create({
      productId,
      quantity,
      arrivalDate,
      status: "pending",
    });
    return {
      status: 200,
      message: "Pending stock added successfully",
      pendingStock: newPendingStock,
    };
  } catch (error) {
    console.error("Error in addPendingStock service:", error);
    throw error;
  }
};

const confirmStock = async (pendingStockId) => {
  try {
    const pendingStock = await PendingStock.findByPk(pendingStockId);
    if (!pendingStock) {
      throw {
        status: 404,
        data: {
          message: `Pending stock with the id of ${pendingStockId} not found.`,
        },
      };
    }

    if (pendingStock.status === "arrived") {
      throw {
        status: 400,
        data: { message: "Pending stock already confirmed" },
      };
    }

    const product = await Product.findByPk(pendingStock.productId);
    if (!product) {
      throw {
        status: 404,
        data: {
          message: `Product not found with ID: ${pendingStock.productId}`,
        },
      };
    }

    product.stock += pendingStock.quantity;
    await product.save();

    pendingStock.status = "arrived";
    await pendingStock.save();

    return {
      status: 200,
      message: "Stock confirmed successfully",
      product,
    };
  } catch (error) {
    console.error("Error in confirmStock service:", error);
    throw error;
  }
};

const cancelPendingStock = async (pendingStockId) => {
  try {
    const pendingStock = await PendingStock.findByPk(pendingStockId);
    if (!pendingStock) {
      throw {
        status: 404,
        data: {
          message: `Pending stock with id of ${pendingStockId} was not found.`,
        },
      };
    }

    if (pendingStock.status === "arrived") {
      throw {
        status: 400,
        data: { message: "Cannot cancel a stock that has already arrived" },
      };
    }

    pendingStock.status = "canceled";
    await pendingStock.save();

    return {
      status: 200,
      message: "Pending stock canceled successfully",
      pendingStock,
    };
  } catch (error) {
    console.error("Error in cancelPendingStock service:", error);
    throw error;
  }
};

const getAllPendingStocks = async () => {
  try {
    const pendingStocks = await PendingStock.findAll({
      where: { status: "pending" },
    });
    return {
      status: 200,
      pendingStocks,
    };
  } catch (error) {
    console.error("Error in getAllPendingStocks service:", error);
    throw error;
  }
};

const updateArrivalDate = async ({ pendingStockId, newArrivalDate }) => {
  try {
    const pendingStock = await PendingStock.findByPk(pendingStockId);
    if (!pendingStock) {
      throw {
        status: 404,
        data: {
          message: `Pending stock with id ${pendingStockId} was not found.`,
        },
      };
    }

    pendingStock.arrivalDate = newArrivalDate;
    await pendingStock.save();

    return {
      status: 200,
      message: "Arrival date updated successfully",
      pendingStock,
    };
  } catch (error) {
    console.error("Error in updateArrivalDate service:", error);
    throw error;
  }
};

const getMonthStartAndEnd = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { start, end };
};

const getTopBestSellerItems = async () => {
  const { start, end } = getMonthStartAndEnd();

  try {
    const result = await TransactionItems.findAll({
      attributes: [
        [col("Product.name"), "productName"],
        [col("Product.price"), "price"],
        [fn("SUM", col("TransactionItems.quantity")), "totalSold"],
        [
          literal(
            'SUM("TransactionItems"."quantity" * ("TransactionItems"."unitPrice" - "Product"."supplierCost"))'
          ),
          "totalProfit",
        ],
      ],
      include: [
        {
          model: Product,
          attributes: [],
        },
        {
          model: TransactionHistories,
          attributes: [],
          required: true,
          where: {
            transactionDate: {
              [Op.between]: [start, end],
            },
          },
        },
      ],
      group: [
        "TransactionItems.productId",
        "Product.id",
        "Product.name",
        "Product.price",
      ],
      order: [[fn("SUM", col("TransactionItems.quantity")), "DESC"]],
      limit: 5, // Always fetch top 5 best sellers
    });

    if (result.length > 0) {
      return {
        status: 200,
        message: "Top best seller items fetched successfully",
        data: result.map((item) => item.get()),
      };
    } else {
      return {
        status: 404,
        message: "No items found",
        data: [],
      };
    }
  } catch (error) {
    console.error("Error in getTopBestSellerItems service:", error);
    throw error;
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductByItemCode,
  getProductByBrand,
  getProductByPriceRange,
  getProductByNameOrDescription,
  getProductsByDateRange,
  getLowStockProducts,
  addToProductStock,
  getProductById,
  updateProductById,
  deleteProductById,
  addPendingStock,
  confirmStock,
  cancelPendingStock,
  getAllPendingStocks,
  updateArrivalDate,
  getTopBestSellerItems,
};
