"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("TransactionItems", "productName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("TransactionItems", "unitPrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addColumn("TransactionItems", "subtotalAmount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addColumn("TransactionItems", "amountPaid", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addConstraint("TransactionItems", {
      fields: ["transactionId"],
      type: "foreign key",
      name: "fk_transactionItem_transactionHistory",
      references: {
        table: "TransactionHistory",
        field: "transactionId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("TransactionItems", {
      fields: ["productId"],
      type: "foreign key",
      name: "fk_transactionItem_product",
      references: {
        table: "Products",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("TransactionItems", "productName");
    await queryInterface.removeColumn("TransactionItems", "unitPrice");
    await queryInterface.removeColumn("TransactionItems", "subtotalAmount");
    await queryInterface.removeColumn("TransactionItems", "amountPaid");

    await queryInterface.removeConstraint(
      "TransactionItems",
      "fk_transactionItem_transactionHistory"
    );
    await queryInterface.removeConstraint(
      "TransactionItems",
      "fk_transactionItem_product"
    );
  },
};
