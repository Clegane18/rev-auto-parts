"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "imageUrl");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "imageUrl", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
