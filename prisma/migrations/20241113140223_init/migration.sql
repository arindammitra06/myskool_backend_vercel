/*
  Warnings:

  - Added the required column `reason` to the `LoanRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LoanRequest` ADD COLUMN `reason` VARCHAR(4000) NOT NULL;
