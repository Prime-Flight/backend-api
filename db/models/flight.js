'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Flight.init({
    flight_code: DataTypes.STRING,
    departure_iata_code: DataTypes.STRING,
    departure_icao_code: DataTypes.STRING,
    departure_time: DataTypes.DATE,
    arrival_iata_code: DataTypes.STRING,
    arrival_icao_code: DataTypes.STRING,
    arrival_time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};