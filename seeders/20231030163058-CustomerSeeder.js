'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    function generateUniqueInvoiceNumber() {
      // Logic to generate a unique invoice number
      // For example, you can combine current timestamp with a random number
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      return `INV-${timestamp}-${random}`;
    }

    await queryInterface.bulkInsert('customers', [
      {
        name: 'Customer 1',
        no_whatsapp: '1234567890',
        no_invoice: generateUniqueInvoiceNumber(),
        tokenId: 1, // Sesuaikan dengan ID token yang sesuai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Customer 2',
        no_whatsapp: '9876543210',
        no_invoice: generateUniqueInvoiceNumber(),
        tokenId: 2, // Sesuaikan dengan ID token yang sesuai
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};
