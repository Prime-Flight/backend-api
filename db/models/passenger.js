'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Passenger.init({
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    
    passenger_category: DataTypes.ENUM('child', 'adult'),
    
    passenger_detail: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Passenger',
  });
  return Passenger;
};

