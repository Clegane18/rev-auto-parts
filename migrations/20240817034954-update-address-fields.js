module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Addresses", "addressLine", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE "Addresses"
      SET "addressLine" = COALESCE("streetName", '') || ' ' || COALESCE("building", '') || ' ' || COALESCE("houseNumber", '')
    `);

    await queryInterface.removeColumn("Addresses", "streetName");
    await queryInterface.removeColumn("Addresses", "building");
    await queryInterface.removeColumn("Addresses", "houseNumber");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Addresses", "streetName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Addresses", "building", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Addresses", "houseNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE "Addresses"
      SET "streetName" = substring("addressLine" from '^([^\\s]+)'),
          "building" = substring("addressLine" from '\\s([^\\s]+)\\s'),
          "houseNumber" = substring("addressLine" from '\\s([^\\s]+)$')
    `);

    await queryInterface.removeColumn("Addresses", "addressLine");
  },
};
