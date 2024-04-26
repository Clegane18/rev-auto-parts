"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TransactionHistory", {
      transactionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      transactionReceipt: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      transactionType: {
        type: Sequelize.STRING,
        allowNull: false,
        // Types could include 'purchase', 'refund', 'return', etc.
      },
      transactionStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        // Examples: 'completed', 'refunded', 'returned'
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      totalItemsBought: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TransactionHistories");
  },
};
