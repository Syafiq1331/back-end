'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const customerProperties = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
    },
    // tokenId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'tokens',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // },
  }

  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Token)
    }
  }
  Customer.init(
    customerProperties, {
    sequelize,
    modelName: 'Customer',
    underscored: true,
  })

  return Customer;
};


// const Customer = sequelize.define(
//   'Customer',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     whatsappNumber: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     invoiceNumber: {
//       type: DataTypes.STRING,
//     },
//     tokenId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: 'tokens',
//         key: 'id',
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL',
//     },
//   },
//   {
//     tableName: 'customers',
//   }
// );

// Definisi hubungan "Customer memiliki banyak Token"
// Customer.associate = (models) => {
//   Customer.belongsTo(models.Token, {
//     foreignKey: 'tokenId', // Nama atribut kunci asing di tabel Customer yang merujuk ke Token
//     as: 'token', // Alias yang digunakan untuk mengakses Token pelanggan
//   });
// };