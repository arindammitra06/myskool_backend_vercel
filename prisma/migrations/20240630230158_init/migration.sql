/*
  Warnings:

  - The `dueDate` column on the `StudentInvoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `StudentInvoices` DROP COLUMN `dueDate`,
    ADD COLUMN `dueDate` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);
