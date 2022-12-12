'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    destination: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    seat: DataTypes.INTEGER,
    status: DataTypes.ENUM('Rejected', 'Canceled', 'Pending', 'Success'),
    booking_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};

