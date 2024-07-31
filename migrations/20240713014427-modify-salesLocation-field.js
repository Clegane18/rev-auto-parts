"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'UPDATE "TransactionHistories" SET "salesLocation" = \'POS\' WHERE "salesLocation" = \'physical\';'
    );

    await queryInterface.sequelize.query(
      'ALTER TABLE "TransactionHistories" ALTER COLUMN "salesLocation" DROP DEFAULT;'
    );

    await queryInterface.changeColumn("TransactionHistories", "salesLocation", {
      type: Sequelize.ENUM("POS", "online"),
      allowNull: false,
    });

    await queryInterface.sequelize.query(
      'ALTER TABLE "TransactionHistories" ALTER COLUMN "salesLocation" SET DEFAULT \'POS\';'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE "TransactionHistories" ALTER COLUMN "salesLocation" DROP DEFAULT;'
    );

    await queryInterface.changeColumn("TransactionHistories", "salesLocation", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.sequelize.query(
      'ALTER TABLE "TransactionHistories" ALTER COLUMN "salesLocation" SET DEFAULT \'physical\';'
    );

    await queryInterface.sequelize.query(
      'UPDATE "TransactionHistories" SET "salesLocation" = \'physical\' WHERE "salesLocation" = \'POS\';'
    );
  },
};
