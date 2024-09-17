"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Customers", "accountStatus", {
      type: Sequelize.ENUM("Active", "Suspended"),
      allowNull: false,
      defaultValue: "Active",
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Customers", "accountStatus");
  },
};
