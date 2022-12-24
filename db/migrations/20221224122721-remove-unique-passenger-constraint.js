'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Passengers', 'Passengers_buyer_id_key');
    await queryInterface.removeConstraint('Passengers', 'Passengers_passenger_detail_key');
    await queryInterface.removeConstraint('PassengerDetails', 'PassengerDetails_name_key');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Passengers', {
      fields:['buyer_id'], type: 'unique', name: 'Passengers_buyer_id_key' 
    });
    await queryInterface.addConstraint('Passengers', {
      fields: ['passenger_detail'], type: 'unique', name: 'Passengers_passenger_detail_key'
    });
    await queryInterface.addConstraint('PassengerDetails', {
      fields: ['name'], type: 'unique', name: 'PassengerDetails_name_key'
    });
  }
};
