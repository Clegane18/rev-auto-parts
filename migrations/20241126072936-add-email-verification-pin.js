"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Customers");

    if (!table.emailVerified) {
      await queryInterface.addColumn("Customers", "emailVerified", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    if (!table.emailVerificationPin) {
      await queryInterface.addColumn("Customers", "emailVerificationPin", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.pinExpiresAt) {
      await queryInterface.addColumn("Customers", "pinExpiresAt", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("Customers");

    if (table.emailVerified) {
      await queryInterface.removeColumn("Customers", "emailVerified");
    }

    if (table.emailVerificationPin) {
      await queryInterface.removeColumn("Customers", "emailVerificationPin");
    }

    if (table.pinExpiresAt) {
      await queryInterface.removeColumn("Customers", "pinExpiresAt");
    }
  },
};
