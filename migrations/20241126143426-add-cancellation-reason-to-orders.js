"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Orders", "cancellationReason", {
      type: Sequelize.ENUM(
        "Need to change delivery address",
        "Need to input/change voucher",
        "Need to modify order",
        "Payment procedure too troublesome",
        "Found cheaper elsewhere",
        "Don't want to buy anymore",
        "Others"
      ),
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Orders", "cancellationReason");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Orders_cancellationReason";'
    );
  },
};
