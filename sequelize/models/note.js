'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    modelName: "Note"
  })
  // const Notes = sequelize.define(
  //   "Notes",
  //   {
  //     id: {
  //       type: DataTypes.INTEGER,
  //       primaryKey: true,
  //       autoIncrement: true,
  //       allowNull: false
  //     },
  //     title: {
  //       type: DataTypes.STRING,
  //     },
  //     description: {
  //       type: DataTypes.STRING,
  //     },
  //     createdAt: {
  //       type: DataTypes.DATE,
  //       allowNull: false
  //     },
  //     updatedAt: {
  //       type: DataTypes.DATE,
  //       allowNull: false
  //     }
  //   },
  //   {
  //     tableName: 'notes',
  //   }
  // )
  return Notes;
}