"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "Orders",
      "totalAmount",
      "merchandiseSubtotal"
    );
    await queryInterface.addColumn("Orders", "totalAmount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "Orders",
      "merchandiseSubtotal",
      "totalAmount"
    );
    await queryInterface.removeColumn("Orders", "totalAmount");
  },
};
