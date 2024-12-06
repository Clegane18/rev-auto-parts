"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("Customers");
    if (!tableDefinition.emailVerified) {
      await queryInterface.addColumn("Customers", "emailVerified", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Customers", "emailVerified");
  },
};
