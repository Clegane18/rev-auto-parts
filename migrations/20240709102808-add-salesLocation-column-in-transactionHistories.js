module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("TransactionHistories", "salesLocation", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "physical", // Default to 'physical' for existing records
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("TransactionHistories", "salesLocation");
  },
};
