module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Addresses", "distanceFromMetroManila", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Addresses", "distanceFromMetroManila");
  },
};
