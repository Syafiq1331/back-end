'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10); // Ganti dengan password yang Anda inginkan

    await queryInterface.bulkInsert('users', [
      {
        nama: 'User 1',
        email: 'user1@example.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nama: 'User 2',
        email: 'user2@example.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
