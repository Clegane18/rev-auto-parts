"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Orders", "paymentStatus", {
      type: Sequelize.ENUM("Pending", "Paid"),
      allowNull: false,
      defaultValue: "Pending",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orders", "paymentStatus");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Orders_paymentStatus";'
    );
  },
};
