"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Customers", "emailVerified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("Customers", "emailVerificationPin", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Customers", "pinExpiresAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Customers", "emailVerified");
    await queryInterface.removeColumn("Customers", "emailVerificationPin");
    await queryInterface.removeColumn("Customers", "pinExpiresAt");
  },
};
