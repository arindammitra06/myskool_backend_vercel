/*
  Warnings:

  - You are about to alter the column `amount` on the `PaySlip` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `paidAmount` on the `SalaryPaymentRecord` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `monthlySalary` on the `SalaryPlan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `yearlySalary` on the `SalaryPlan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `monthlydeductables` on the `SalaryPlan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `SalaryPlanBreakup` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `PaySlip` MODIFY `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `SalaryPaymentRecord` MODIFY `paidAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `SalaryPlan` MODIFY `monthlySalary` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    MODIFY `yearlySalary` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    MODIFY `monthlydeductables` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `SalaryPlanBreakup` MODIFY `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;
