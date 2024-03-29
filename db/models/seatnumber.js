'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeatNumber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SeatNumber.init({
    seat_number: DataTypes.STRING,
    booking_detail_id: DataTypes.INTEGER,
    passenger_id: DataTypes.INTEGER,
    flight_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SeatNumber',
  });
  return SeatNumber;
};