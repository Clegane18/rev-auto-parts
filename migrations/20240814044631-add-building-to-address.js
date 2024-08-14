module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Addresses", "building", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Addresses", "building");
  },
};
