'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Access extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Access.init({
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    read: DataTypes.BOOLEAN,
    write: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Access',
  });
  return Access;
};

