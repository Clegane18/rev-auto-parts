"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Customers", "phoneNumber", {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: /^(\+63)[0-9]{10}$/,
      },
    });

    await queryInterface.addColumn("Customers", "gender", {
      type: Sequelize.ENUM,
      values: ["Male", "Female", "Other"],
      allowNull: true,
    });

    await queryInterface.addColumn("Customers", "dateOfBirth", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Customers", "phoneNumber");
    await queryInterface.removeColumn("Customers", "gender");
    await queryInterface.removeColumn("Customers", "dateOfBirth");
  },
};
