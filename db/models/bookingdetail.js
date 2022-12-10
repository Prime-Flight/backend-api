'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BookingDetail.init({
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    document_url: DataTypes.STRING,
    price_per_seat: DataTypes.FLOAT,
    user_cancel_reason: DataTypes.TEXT,
    admin_reject_reason: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'BookingDetail',
  });
  return BookingDetail;
};