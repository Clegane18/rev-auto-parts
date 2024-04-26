"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "TransactionHistory",
      "transactionReceipt",
      "transactionNo"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "TransactionHistory",
      "transactionNo",
      "transactionReceipt"
    );
  },
};
