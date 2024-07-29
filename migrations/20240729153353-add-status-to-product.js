"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "status", {
      type: Sequelize.ENUM("draft", "published", "ready"),
      allowNull: false,
      defaultValue: "draft",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "status");
  },
};
