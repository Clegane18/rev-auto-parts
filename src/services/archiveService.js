const ArchivedProduct = require("../database/models/archivedProductModel");
const Product = require("../database/models/inventoryProductModel");
const PendingStock = require("../database/models/pendingStockModel");
const { Op } = require("sequelize");
const { differenceInDays, addYears } = require("date-fns");

const archiveProductById = async ({ productId }) => {
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
      where: { productName: product.name },
    });

    const hasPendingStatus = pendingStocks.some(
      (stock) => stock.status === "pending"
    );

    if (hasPendingStatus) {
      throw {
        status: 400,
        message: `Cannot archive product with ID ${id} because it has incoming pending stock.`,
      };
    }

    await ArchivedProduct.create({
      ...product.toJSON(),
      archivedAt: new Date(),
    });

    await PendingStock.destroy({
      where: {
        productName: product.name,
        status: { [Op.not]: "pending" },
      },
    });

    await product.destroy();

    return {
      status: 200,
      message: `Product with ID ${id} successfully archived.`,
    };
  } catch (error) {
    console.error("Error in archiveProductById service:", error);
    throw error;
  }
};

const getAllArchivedProducts = async ({ sortOrder = "ASC" }) => {
  try {
    const orderDirection =
      String(sortOrder).toUpperCase() === "DESC" ? "DESC" : "ASC";

    const archivedProducts = await ArchivedProduct.findAll({
      order: [["id", orderDirection]],
    });

    return {
      status: 200,
      data: archivedProducts,
    };
  } catch (error) {
    console.error("Error in getAllArchivedProducts service:", error);
    throw error;
  }
};

const restoreArchivedProductById = async ({ productId }) => {
  try {
    const id = parseInt(productId, 10);
    const archivedProduct = await ArchivedProduct.findByPk(id);

    if (!archivedProduct) {
      throw {
        status: 404,
        message: `Archived product not found with ID: ${id}`,
      };
    }

    const existingProduct = await Product.findOne({
      where: { name: archivedProduct.name },
    });

    if (existingProduct) {
      throw {
        status: 400,
        message: `Cannot restore archived product with ID ${id} because a product with the same name already exists.`,
      };
    }

    await Product.create({
      ...archivedProduct.toJSON(),
      status: "draft",
    });

    await archivedProduct.destroy();

    return {
      status: 200,
      message: `Archived product with ID ${id} successfully restored.`,
    };
  } catch (error) {
    console.error("Error in restoreArchivedProductById service:", error);
    throw error;
  }
};

const restoreMultipleArchivedProducts = async ({ productIds }) => {
  try {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw {
        status: 400,
        message: "No product IDs provided for restoration.",
      };
    }

    const results = [];

    for (const productId of productIds) {
      try {
        const id = parseInt(productId, 10);
        const archivedProduct = await ArchivedProduct.findByPk(id);

        if (!archivedProduct) {
          results.push({
            id,
            status: 404,
            message: `Archived product not found with ID: ${id}`,
          });
          continue;
        }

        const existingProduct = await Product.findOne({
          where: { name: archivedProduct.name },
        });

        if (existingProduct) {
          results.push({
            id,
            status: 400,
            message: `Cannot restore archived product with ID ${id} because a product with the same name already exists.`,
          });
          continue;
        }

        await Product.create({
          ...archivedProduct.toJSON(),
          status: "draft",
        });

        await archivedProduct.destroy();

        results.push({
          id,
          status: 200,
          message: `Archived product with ID ${id} successfully restored.`,
        });
      } catch (error) {
        console.error(`Error restoring product with ID ${productId}:`, error);
        results.push({
          id: productId,
          status: error.status || 500,
          message: error.message || "An unknown error occurred.",
        });
      }
    }

    return {
      status: 200,
      message: "Restoration process completed.",
      results,
    };
  } catch (error) {
    console.error("Error in restoreMultipleArchivedProducts service:", error);
    throw error;
  }
};

const restoreAllArchivedProducts = async () => {
  try {
    const archivedProducts = await ArchivedProduct.findAll();

    if (!archivedProducts || archivedProducts.length === 0) {
      throw {
        status: 400,
        message: "No archived products found for restoration.",
      };
    }

    const results = [];

    for (const archivedProduct of archivedProducts) {
      try {
        const id = archivedProduct.id;

        const existingProduct = await Product.findOne({
          where: { name: archivedProduct.name },
        });

        if (existingProduct) {
          results.push({
            id,
            status: 400,
            message: `Cannot restore archived product with ID ${id} because a product with the same name already exists.`,
          });
          continue;
        }

        await Product.create({
          ...archivedProduct.toJSON(),
          status: "draft",
        });

        await archivedProduct.destroy();

        results.push({
          id,
          status: 200,
          message: `Archived product with ID ${id} successfully restored.`,
        });
      } catch (error) {
        console.error(
          `Error restoring product with ID ${archivedProduct.id}:`,
          error
        );
        results.push({
          id: archivedProduct.id,
          status: error.status || 500,
          message: error.message || "An unknown error occurred.",
        });
      }
    }

    return {
      status: 200,
      message: "Restoration process for all archived products completed.",
      results,
    };
  } catch (error) {
    console.error("Error in restoreAllArchivedProducts service:", error);
    throw error;
  }
};

const permanentlyDeleteArchivedProduct = async ({ productId }) => {
  try {
    const id = parseInt(productId, 10);
    const product = await ArchivedProduct.findByPk(id);

    if (!product) {
      throw {
        status: 404,
        message: `Product not found with ID: ${id}`,
      };
    }

    const productName = product.name;

    const pendingStocks = await PendingStock.findAll({
      where: { productName },
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
      where: { productName, status: { [Op.not]: "pending" } },
    });

    await product.destroy();

    return {
      status: 200,
      message: `Product with ID ${id} and name ${productName} successfully deleted from the inventory.`,
    };
  } catch (error) {
    console.error("Error in permanentlyDeleteArchivedProduct service:", error);
    throw error;
  }
};

const deleteAllArchivedProducts = async () => {
  try {
    const archivedProducts = await ArchivedProduct.findAll();

    if (!archivedProducts || archivedProducts.length === 0) {
      throw {
        status: 400,
        message: "No archived products found for deletion.",
      };
    }

    const results = [];

    for (const archivedProduct of archivedProducts) {
      try {
        const id = archivedProduct.id;

        await archivedProduct.destroy();

        results.push({
          id,
          status: 200,
          message: `Archived product with ID ${id} successfully deleted.`,
        });
      } catch (error) {
        console.error(
          `Error deleting product with ID ${archivedProduct.id}:`,
          error
        );
        results.push({
          id: archivedProduct.id,
          status: error.status || 500,
          message: error.message || "An unknown error occurred.",
        });
      }
    }

    return {
      status: 200,
      message: "Deletion process for all archived products completed.",
      results,
    };
  } catch (error) {
    console.error("Error in deleteAllArchivedProducts service:", error);
    throw error;
  }
};

const autoDeleteArchivedProducts = async () => {
  try {
    const now = new Date();
    const oneYearAgo = addYears(now, -1);

    const productsToDelete = await ArchivedProduct.findAll({
      where: {
        archivedAt: {
          [Op.lte]: oneYearAgo,
        },
      },
    });

    const deletedProducts = [];
    for (const product of productsToDelete) {
      await product.destroy();
      deletedProducts.push({
        id: product.id,
        name: product.name,
        archivedAt: product.archivedAt,
      });
    }

    const allArchivedProducts = await ArchivedProduct.findAll();

    const productsWithDaysRemaining = allArchivedProducts.map((product) => {
      const deleteDate = addYears(product.archivedAt, 1);
      const daysRemaining = differenceInDays(deleteDate, now);
      return {
        id: product.id,
        name: product.name,
        archivedAt: product.archivedAt,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      };
    });

    return {
      status: 200,
      message: "Automatic deletion process completed.",
      deletedCount: deletedProducts.length,
      deletedProducts,
      productsWithDaysRemaining,
    };
  } catch (error) {
    console.error("Error in autoDeleteArchivedProducts service:", error);
    throw {
      status: 500,
      message: "An error occurred during the automatic deletion process.",
      error: error.message,
    };
  }
};

module.exports = {
  archiveProductById,
  restoreArchivedProductById,
  getAllArchivedProducts,
  restoreMultipleArchivedProducts,
  restoreAllArchivedProducts,
  deleteAllArchivedProducts,
  permanentlyDeleteArchivedProduct,
  autoDeleteArchivedProducts,
};
