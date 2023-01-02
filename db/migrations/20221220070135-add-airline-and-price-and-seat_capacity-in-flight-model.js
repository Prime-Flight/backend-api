'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Flights', 'airline_id', { type: Sequelize.DataTypes.INTEGER });
    await queryInterface.addColumn('Flights', 'price', { type: Sequelize.DataTypes.FLOAT });
    await queryInterface.addColumn('Flights', 'seat_capacity', { type: Sequelize.DataTypes.INTEGER });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Flights', 'airline_id');
    await queryInterface.removeColumn('Flights', 'price');
    await queryInterface.removeColumn('Flights', 'seat_capacity');
  }
};
