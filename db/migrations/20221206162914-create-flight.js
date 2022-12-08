'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flight_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      departure_iata_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      departure_icao_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      departure_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      arrival_iata_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      arrival_icao_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      arrival_time: {
        allowNull: false,
        type: Sequelize.DATE
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Flights');
  }
};
