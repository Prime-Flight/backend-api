'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('BookingDetails', 'qr_url',
      { type: Sequelize.DataTypes.STRING });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('BookingDetails', 'qr_url');
  }
};
