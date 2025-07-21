/*
  Warnings:

  - You are about to drop the column `max_income` on the `TaxRebate` table. All the data in the column will be lost.
  - You are about to drop the column `max_rebate` on the `TaxRebate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TaxRebate` DROP COLUMN `max_income`,
    DROP COLUMN `max_rebate`,
    ADD COLUMN `maxIncome` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `minIncome` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `rebateAmount` DOUBLE NOT NULL DEFAULT 0;
