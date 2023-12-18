'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: "TOKEN LISTRIK - 100.000",
        price: 95000,
        quantity_stock: 999,
        exact_cost: 100000,
        created_at: new Date(),
        modified_at: new Date()
      },
      {
        name: "TOKEN LISTRIK - 200.000",
        price: 195000,
        exact_cost: 200000,
        quantity_stock: 999,
        created_at: new Date(),
        modified_at: new Date()
      },
      {
        name: "TOKEN LISTRIK - 300.000",
        price: 295000,
        exact_cost: 300000,
        quantity_stock: 999,
        created_at: new Date(),
        modified_at: new Date()
      },
      {
        name: "TOKEN LISTRIK - 400.000",
        price: 395000,
        exact_cost: 400000,
        quantity_stock: 999,
        created_at: new Date(),
        modified_at: new Date()
      },
      {
        name: "TOKEN LISTRIK - 500.000",
        price: 495000,
        exact_cost: 500000,
        quantity_stock: 999,
        created_at: new Date(),
        modified_at: new Date()
      },
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete('products', null, {});
  }
};
