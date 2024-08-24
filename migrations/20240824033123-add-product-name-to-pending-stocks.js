module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("PendingStocks", "productName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("PendingStocks", "productName");
  },
};
