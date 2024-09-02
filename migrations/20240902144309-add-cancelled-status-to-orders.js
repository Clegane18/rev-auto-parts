"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Orders", "status", {
      type: Sequelize.ENUM(
        "To Pay",
        "To Ship",
        "To Receive",
        "Completed",
        "Cancelled"
      ),
      allowNull: false,
      defaultValue: "To Pay",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Orders", "status", {
      type: Sequelize.ENUM("To Pay", "To Ship", "To Receive", "Completed"),
      allowNull: false,
      defaultValue: "To Pay",
    });
  },
};
