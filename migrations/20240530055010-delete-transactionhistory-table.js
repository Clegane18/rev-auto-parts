"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove foreign key constraint from TransactionItems table
    await queryInterface.removeConstraint(
      "TransactionItems",
      "TransactionItems_transactionId_fkey"
    );

    // Remove constraints from TransactionHistory table
    await queryInterface.removeConstraint(
      "TransactionHistory",
      "TransactionHistory_pkey"
    );
    await queryInterface.removeConstraint(
      "TransactionHistory",
      "TransactionHistory_transactionReceipt_key"
    );
    await queryInterface.removeConstraint(
      "TransactionHistory",
      "transactionhistory_transactionreceipt_key"
    );

    // Drop the TransactionHistory table
    await queryInterface.dropTable("TransactionHistory");
  },

  async down(queryInterface, Sequelize) {
    // Recreate the TransactionHistory table
    await queryInterface.createTable("TransactionHistory", {
      transactionId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transactionNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      transactionType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transactionStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
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
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Recreate constraints
    await queryInterface.addConstraint("TransactionHistory", {
      fields: ["transactionId"],
      type: "primary key",
      name: "TransactionHistory_pkey",
    });
    await queryInterface.addConstraint("TransactionHistory", {
      fields: ["transactionNo"],
      type: "unique",
      name: "TransactionHistory_transactionReceipt_key",
    });
    await queryInterface.addConstraint("TransactionHistory", {
      fields: ["transactionNo"],
      type: "unique",
      name: "transactionhistory_transactionreceipt_key",
    });

    // Add the foreign key constraint back to TransactionItems table
    await queryInterface.addConstraint("TransactionItems", {
      fields: ["transactionId"],
      type: "foreign key",
      name: "TransactionItems_transactionId_fkey",
      references: {
        table: "TransactionHistory",
        field: "transactionId",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
};
