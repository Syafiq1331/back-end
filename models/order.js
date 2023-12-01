'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    item: {
      type: DataTypes.STRING
    },
    descriptions,
    amount,
    paymentStatus,
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'cancelled', 'accepted']
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};