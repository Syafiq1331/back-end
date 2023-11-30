module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
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
      no_whatsapp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      no_invoice: {
        type: DataTypes.STRING,
      },
      tokenId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'tokens',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      tableName: 'customers',
    }
  );

  // Definisi hubungan "Customer memiliki banyak Token"
  Customer.associate = (models) => {
    Customer.belongsTo(models.Token, {
      foreignKey: 'tokenId', // Nama atribut kunci asing di tabel Customer yang merujuk ke Token
      as: 'token', // Alias yang digunakan untuk mengakses Token pelanggan
    });
  };

  return Customer;
};
