"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists before adding it
    const transactionItemsTableInfo = await queryInterface.describeTable(
      "TransactionItems"
    );
    if (!transactionItemsTableInfo.productId) {
      await queryInterface.addColumn("TransactionItems", "productId", {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
      });
    }

    // Add other new columns similarly

    // Remove old columns
    await queryInterface.removeColumn("TransactionHistories", "productId");
    await queryInterface.removeColumn("TransactionHistories", "quantity");
    await queryInterface.removeColumn("TransactionHistories", "amountPaid");
  },

  down: async (queryInterface, Sequelize) => {
    // Add back old columns
    await queryInterface.addColumn("TransactionHistories", "productId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Product",
        key: "id",
      },
    });

    await queryInterface.addColumn("TransactionHistories", "quantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addColumn("TransactionHistories", "amountPaid", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    // Remove new columns
    await queryInterface.removeColumn("TransactionItems", "productId");
    await queryInterface.removeColumn("TransactionItems", "quantity");
    await queryInterface.removeColumn("TransactionItems", "amountPaid");
  },
};
