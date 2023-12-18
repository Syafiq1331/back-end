'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    modelName: 'User'
  })
  // const User = sequelize.define(
  //   'User',
  //   {
  //     id: {
  //       type: DataTypes.INTEGER,
  //       primaryKey: true,
  //       autoIncrement: true,
  //       allowNull: false,
  //     },
  //     nama: {
  //       type: DataTypes.STRING,
  //       allowNull: false,
  //     },
  //     email: {
  //       type: DataTypes.STRING,
  //       allowNull: false,
  //       unique: true,
  //     },
  //     password: {
  //       type: DataTypes.STRING,
  //       allowNull: false,
  //     },
  //     createdAt: {
  //       type: DataTypes.DATE,
  //       allowNull: false,
  //     },
  //     updatedAt: {
  //       type: DataTypes.DATE,
  //       allowNull: false,
  //     },
  //   },
  //   {
  //     tableName: 'users',
  //   }
  // );

  return User;
};
