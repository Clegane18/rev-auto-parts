"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Customers", "googleId", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.changeColumn("Customers", "password", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Customers", "googleId");
    await queryInterface.changeColumn("Customers", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
