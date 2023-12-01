'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invoice.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING, // INV-2931032283-aec7
      unique: true,
      allowNull: false
    },
    items: {
      type: DataTypes.String,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.INTEGER,
      references: {
        model: Transactions,
        key: 'id'
      },
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    status: {
      type: DataTypes.ENUM,
      values: ['unpaid', 'cancelled', 'paid']
    }
  }, {
    sequelize,
    modelName: 'Invoice',
  });
  return Invoice;
};