module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Customers", "email", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Customers", "email", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
