"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("TransactionItems", {
      fields: ["productId"],
      type: "foreign key",
      name: "fk_product_id",
      references: {
        table: "Products",
        field: "id",
      },
      onDelete: "CASCADE", // or other actions like 'SET NULL', 'RESTRICT', etc.
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("TransactionItems", "fk_product_id");
  },
};
