/*
  Warnings:

  - You are about to drop the column `paidAmount` on the `PaySlip` table. All the data in the column will be lost.
  - You are about to drop the column `paidOn` on the `PaySlip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `PaySlip` DROP COLUMN `paidAmount`,
    DROP COLUMN `paidOn`;

-- AlterTable
ALTER TABLE `SalaryPlanBreakup` ADD COLUMN `isDeductable` TINYINT NOT NULL DEFAULT 0;
