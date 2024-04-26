"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns
    await queryInterface.addColumn("TransactionItems", "transactionItemId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });

    // Remove old columns
    await queryInterface.removeColumn("TransactionItems", "itemId");
  },

  down: async (queryInterface, Sequelize) => {
    // Add back old columns
    await queryInterface.addColumn("TransactionItems", "itemId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    });

    // Remove new columns
    await queryInterface.removeColumn("TransactionItems", "transactionItemId");
  },
};
