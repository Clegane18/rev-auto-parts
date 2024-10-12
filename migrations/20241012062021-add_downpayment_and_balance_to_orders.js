"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Orders", "downpayment_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
      comment: "20% downpayment for in-store pickup orders",
    });

    await queryInterface.addColumn("Orders", "remaining_balance", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
      comment: "Remaining balance to be paid upon pickup",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Orders", "remaining_balance");
    await queryInterface.removeColumn("Orders", "downpayment_amount");
  },
};
