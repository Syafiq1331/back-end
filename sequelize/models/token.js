'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Customer, {
        foreignKey: 'token_id', // Nama atribut kunci asing di tabel Customer yang merujuk ke Token
        as: 'token', // Alias yang digunakan untuk mengakses Customer yang memiliki Token
      });
    }
  }
  Token.init({
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
    price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Token',
    underscored: true
  })

  // const Token = sequelize.define(
  //   'Token',
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
  //     price: {
  //       type: DataTypes.STRING,
  //       allowNull: false,
  //     },
  //   },
  //   {
  //     tableName: 'tokens',
  //   }
  // );

  // Definisi hubungan "Token dimiliki oleh Customer"
  // Token.associate = (models) => {
  //   Token.hasOne(models.Customer, {
  //     foreignKey: 'tokenId', // Nama atribut kunci asing di tabel Customer yang merujuk ke Token
  //     as: 'customer', // Alias yang digunakan untuk mengakses Customer yang memiliki Token
  //   });
  // };

  return Token;
};
