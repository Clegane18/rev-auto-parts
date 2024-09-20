require("dotenv").config();
const path = require("path");
const sequelize = require(path.join(__dirname, "../src/database/db"));
const Product = require(path.join(
  __dirname,
  "../src/database/models/inventoryProductModel"
));
const ProductImage = require(path.join(
  __dirname,
  "../src/database/models/productImageModel"
));

const migrateImageUrl = async () => {
  try {
    console.log("Establishing database connection...");
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    console.log("Fetching products with existing imageUrl...");
    const products = await Product.findAll({
      where: {
        imageUrl: {
          [sequelize.Sequelize.Op.ne]: null,
        },
      },
    });

    console.log(`Found ${products.length} products to migrate.`);

    const imagePromises = products
      .map((product) => {
        if (!product.imageUrl) return null;

        return ProductImage.create({
          imageUrl: product.imageUrl,
          isPrimary: true,
          productId: product.id,
        });
      })
      .filter((p) => p !== null);

    console.log("Migrating image URLs to ProductImage table...");
    await Promise.all(imagePromises);
    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateImageUrl();
