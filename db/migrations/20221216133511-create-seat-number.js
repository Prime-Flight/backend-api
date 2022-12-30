'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SeatNumbers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      seat_number: {
        type: Sequelize.STRING
      },
      booking_detail_id: {
        type: Sequelize.INTEGER
      },
      passenger_id: {
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },//
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SeatNumbers');
  }
};