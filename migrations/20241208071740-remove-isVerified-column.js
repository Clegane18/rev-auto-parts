"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Customers", "isVerified");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Customers", "isVerified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
};
