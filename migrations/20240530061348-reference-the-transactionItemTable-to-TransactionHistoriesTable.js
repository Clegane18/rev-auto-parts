"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("TransactionItems", {
      fields: ["transactionId"],
      type: "foreign key",
      name: "fk_transaction_history_id",
      references: {
        // References the TransactionHistories table and its primary key
        table: "TransactionHistories",
        field: "transactionId",
      },
      onDelete: "CASCADE", // Cascade delete if the referenced row in TransactionHistories is deleted
      onUpdate: "CASCADE", // Cascade update if the primary key is updated in TransactionHistories
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "TransactionItems",
      "fk_transaction_history_id"
    );
  },
};
