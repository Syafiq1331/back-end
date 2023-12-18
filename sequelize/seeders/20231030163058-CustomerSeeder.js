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
        whatsapp_number: '1234567890',
        invoice_number: generateUniqueInvoiceNumber(),
        token_id: 1, // Sesuaikan dengan ID token yang sesuai
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Customer 2',
        whatsapp_number: '9876543210',
        invoice_number: generateUniqueInvoiceNumber(),
        token_id: 2, // Sesuaikan dengan ID token yang sesuai
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};
