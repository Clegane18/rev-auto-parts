module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Addresses", "isSetDefaultAddress", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Set default to false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Addresses", "isSetDefaultAddress");
  },
};
