'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      destination: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      user: {
        type: Sequelize.INTEGER
      },
      seat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.ENUM('Rejected', 'Canceled', 'Pending', 'Success')
      },
      booking_code: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Bookings');
  }
};