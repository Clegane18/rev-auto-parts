"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Customers", "verificationCode");
    await queryInterface.removeColumn("Customers", "verificationCodeExpires");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Customers", "verificationCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Customers", "verificationCodeExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
