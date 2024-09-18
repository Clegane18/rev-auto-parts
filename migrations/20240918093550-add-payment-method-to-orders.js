"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Orders", "paymentMethod", {
      type: Sequelize.ENUM,
      values: ["Cash on Delivery", "G-Cash"],
      allowNull: false,
      defaultValue: "Cash on Delivery",
    });

    await queryInterface.addColumn("Orders", "gcashReferenceNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orders", "paymentMethod");
    await queryInterface.removeColumn("Orders", "gcashReferenceNumber");
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_Orders_paymentMethod";'
    );
  },
};
