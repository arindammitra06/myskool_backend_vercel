/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNumber]` on the table `MYAALInvoices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceNumber` to the `MYAALInvoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MYAALInvoices` ADD COLUMN `invoiceNumber` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `MYAALInvoices_invoiceNumber_key` ON `MYAALInvoices`(`invoiceNumber`);
