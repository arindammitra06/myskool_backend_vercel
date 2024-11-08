/*
  Warnings:

  - You are about to drop the column `isDeductable` on the `SalaryPlanBreakup` table. All the data in the column will be lost.
  - You are about to drop the column `isYearly` on the `SalaryPlanBreakup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SalaryPlanBreakup` DROP COLUMN `isDeductable`,
    DROP COLUMN `isYearly`,
    ADD COLUMN `type` VARCHAR(255) NOT NULL DEFAULT 'MONTHLY';
