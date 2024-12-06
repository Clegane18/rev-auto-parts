"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable("Customers");
    if (!tableDescription.emailVerified) {
      await queryInterface.addColumn("Customers", "emailVerified", {
        type: Sequelize.BOOLEAN,
      });
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Customers", "emailVerified");
    await queryInterface.removeColumn("Customers", "emailVerificationToken");
    await queryInterface.removeColumn("Customers", "verificationTokenExpires");
  },
};
