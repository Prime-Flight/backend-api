'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('PassengerDetails', { 
      fields: ['passport_number'],
      type: 'unique',
      name: 'PassengerDetails_unique_passport_number_key'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('PassengerDetails', 'PassengerDetails_unique_passport_number_key');
  }
};
