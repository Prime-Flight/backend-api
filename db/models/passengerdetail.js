'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PassengerDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PassengerDetail.init({
    name: DataTypes.STRING,
    nik: DataTypes.STRING,
    passport_number: DataTypes.STRING,
    gender: DataTypes.ENUM('Male', 'Female')
  }, {
    sequelize,
    modelName: 'PassengerDetail',
  });
  return PassengerDetail;
};