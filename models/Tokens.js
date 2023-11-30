module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'Token',
    {
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
    },
    {
      tableName: 'tokens',
    }
  );

  // Definisi hubungan "Token dimiliki oleh Customer"
  Token.associate = (models) => {
    Token.hasOne(models.Customer, {
      foreignKey: 'tokenId', // Nama atribut kunci asing di tabel Customer yang merujuk ke Token
      as: 'customer', // Alias yang digunakan untuk mengakses Customer yang memiliki Token
    });
  };

  return Token;
};
