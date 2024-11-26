"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Customers", "emailVerified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("Customers", "emailVerificationToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Customers", "verificationTokenExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Customers", "emailVerified");
    await queryInterface.removeColumn("Customers", "emailVerificationToken");
    await queryInterface.removeColumn("Customers", "verificationTokenExpires");
  },
};
