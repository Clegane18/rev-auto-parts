"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update existing rows to match new ENUM values
    await queryInterface.sequelize.query(
      'UPDATE "TransactionHistories" SET "salesLocation" = \'POS\' WHERE "salesLocation" = \'physical\';'
    );

    // Remove the existing default value
    await queryInterface.sequelize.query(
      'ALTER TABLE "TransactionHistories" ALTER COLUMN "salesLocation" DROP DEFAULT;'
    );

    // Change the column type to ENUM without a default value
    await queryInterface.changeColumn("TransactionHistories", "salesLocation", {
      type: Sequelize.ENUM("POS", "online"),
      allowNull: false,
    });

    // Set the default value for the ENUM column
    await queryInterface.sequelize.query(
      'ALTER TABLE "TransactionHistories" ALTER COLUMN "salesLocation" SET DEFAULT \'POS\';'
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes: remove default, change column type back, restore default
    await queryInterface.sequelize.query(
      'ALTER TABLE "TransactionHistories" ALTER COLUMN "salesLocation" DROP DEFAULT;'
    );

    // Change the column type back to STRING
    await queryInterface.changeColumn("TransactionHistories", "salesLocation", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Restore the default value back to 'physical'
    await queryInterface.sequelize.query(
      'ALTER TABLE "TransactionHistories" ALTER COLUMN "salesLocation" SET DEFAULT \'physical\';'
    );

    // Optionally revert updated rows
    await queryInterface.sequelize.query(
      'UPDATE "TransactionHistories" SET "salesLocation" = \'physical\' WHERE "salesLocation" = \'POS\';'
    );
  },
};
