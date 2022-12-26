'use strict';

const replaceEnum = require('sequelize-replace-enum-postgres').default;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return replaceEnum({
      queryInterface,
      tableName: 'Passengers',
      columnName: 'passenger_category',
      newValues: ['Adult', 'Child'],
      enumName: 'enum_Passengers_passenger_category'
    });
     // await queryInterface.changeColumn('Passengers', 'passenger_category',  {type: Sequelize.ENUM, values:[ 'Child', 'Adult' ]});
  },

  async down (queryInterface, Sequelize) {
     // await queryInterface.changeColumn('Passengers',  'passenger_category', {type: Sequelize.ENUM, values:[ 'Child', 'Adult' ] });
    return replaceEnum({
      queryInterface,
      tableName: 'Passengers',
      columnName: 'passenger_category',
      newValues: ['adult', 'child'],
      enumName: 'enum_Passengers_passenger_category'
    });
     
  }
};
