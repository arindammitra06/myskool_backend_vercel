/*
  Warnings:

  - You are about to drop the column `monthlySalary` on the `SalaryPlan` table. All the data in the column will be lost.
  - You are about to drop the column `monthlydeductables` on the `SalaryPlan` table. All the data in the column will be lost.
  - You are about to drop the column `yearlySalary` on the `SalaryPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SalaryPlan` DROP COLUMN `monthlySalary`,
    DROP COLUMN `monthlydeductables`,
    DROP COLUMN `yearlySalary`,
    ADD COLUMN `employeePFMonthly` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `employerPFMonthly` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `gratuityMonthly` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `monthlyInhand` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `professionalTaxMonthly` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `yearlyPackage` DOUBLE NOT NULL DEFAULT 0;
