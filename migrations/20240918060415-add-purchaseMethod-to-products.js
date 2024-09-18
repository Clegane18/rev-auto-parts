"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Products", "purchaseMethod", {
      type: Sequelize.ENUM("delivery", "in-store-pickup"),
      allowNull: false,
      defaultValue: "delivery",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "purchaseMethod");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Products_purchaseMethod";'
    );
  },
};
