'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tokens', [
      {
        nama: 'TOKEN-001',
        price: 12000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nama: 'TOKEN-002',
        price: 12000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tokens', null, {});
  }
};
