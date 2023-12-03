/*
  Warnings:

  - A unique constraint covering the columns `[invoice_number]` on the table `customer_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `customer_orders_invoice_number_key` ON `customer_orders`(`invoice_number`);
