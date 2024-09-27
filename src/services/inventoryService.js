const Product = require("../database/models/inventoryProductModel");
const PendingStock = require("../database/models/pendingStockModel");
const TransactionItems = require("../database/models/transactionItemModel");
const TransactionHistories = require("../database/models/transactionHistoryModel");
const { ProductImage } = require("../database/models/index");
const { getMonthStartAndEnd } = require("../utils/dateUtils");
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
    const existingProduct = await Product.findOne({
      where: {
        category,
        itemCode,
        brand,
        name,
        description,
        price,
        supplierCost,
        supplierName,
      },
    });

    if (existingProduct) {
      return {
        status: 409,
        data: { message: "Product with identical information already exists." },
        product: existingProduct,
      };
    }

    const newProduct = await Product.create({
      category,
      itemCode,
      brand,
      name,
      description,
      price,
      supplierCost,
      stock,
      supplierName,
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
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["imageUrl", "isPrimary"],
        },
      ],
    });

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
    if (!maxPrice) {
      throw {
        status: 400,
        data: { message: "Error: maxPrice is required." },
      };
    }

    if (!minPrice) {
      const productWithLowestPrice = await Product.findOne({
        attributes: [[sequelize.fn("MIN", sequelize.col("price")), "minPrice"]],
      });
      minPrice = productWithLowestPrice.dataValues.minPrice;
    }

    const products = await Product.findAll({
      where: {
        price: {
          [Op.between]: [minPrice, maxPrice],
        },
      },
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

const addPendingStock = async ({ productName, quantity, arrivalDate }) => {
  try {
    const newPendingStock = await PendingStock.create({
      productName,
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

    const product = await Product.findOne({
      where: { name: pendingStock.productName },
    });
    if (!product) {
      throw {
        status: 404,
        data: {
          message: `Product not found with name: ${pendingStock.productName}`,
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

const getTopBestSellerItems = async (limit = 5) => {
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
        [col("TransactionHistory.salesLocation"), "salesLocation"],
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
          as: "TransactionHistory",
        },
      ],
      where: {
        "$TransactionHistory.transactionDate$": {
          [Op.between]: [start, end],
        },
      },
      group: [
        "TransactionItems.productId",
        "Product.id",
        "Product.name",
        "Product.price",
        "TransactionHistory.salesLocation",
      ],
      order: [[fn("SUM", col("TransactionItems.quantity")), "DESC"]],
      limit: limit,
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

const getTotalStock = async () => {
  try {
    const totalStock = await Product.sum("stock");

    return {
      status: 200,
      message: "Successfully fetched the total number of stocks.",
      totalStocks: totalStock,
    };
  } catch (error) {
    console.error("Error in getTotalStock service:", error);
    throw error;
  }
};

const getTotalItems = async () => {
  try {
    const totalItems = await Product.count();

    return {
      status: 200,
      message: "Successfully fetched the total number of Items.",
      totalItems: totalItems,
    };
  } catch (error) {
    console.error("Error in getTotalItems service:", error);
    throw error;
  }
};

const getAllItemsByCategory = async () => {
  try {
    const products = await Product.findAll();

    const groupedProducts = products.reduce((acc, product) => {
      const category = product.category;

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(product);
      return acc;
    }, {});

    const sortedCategories = Object.keys(groupedProducts).sort();

    const sortedGroupedProducts = sortedCategories.reduce((acc, category) => {
      acc[category] = groupedProducts[category];
      return acc;
    }, {});

    return {
      status: 200,
      message: "Successfully fetched all items by category.",
      groupedProducts: sortedGroupedProducts,
    };
  } catch (error) {
    console.error("Error in getAllItemsByCategory service:", error);
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
  addPendingStock,
  confirmStock,
  cancelPendingStock,
  getAllPendingStocks,
  updateArrivalDate,
  getTopBestSellerItems,
  getTotalStock,
  getTotalItems,
  getAllItemsByCategory,
};
