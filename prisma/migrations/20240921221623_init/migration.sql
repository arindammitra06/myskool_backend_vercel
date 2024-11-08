/*
  Warnings:

  - You are about to alter the column `availableCredit` on the `FamilyCredit` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `monthlyAmt` on the `FeePlan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `yearlyAmt` on the `FeePlan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `amount` on the `FeePlanBreakup` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `amount` on the `MYAALInvoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `paidAmount` on the `MYAALInvoices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `amount` on the `PaySlip` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `paidAmount` on the `SalaryPaymentRecord` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `monthlySalary` on the `SalaryPlan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `yearlySalary` on the `SalaryPlan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `monthlydeductables` on the `SalaryPlan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `amount` on the `SalaryPlanBreakup` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `purchasePrice` on the `StockProduct` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `sellPrice` on the `StockProduct` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `amount` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `FamilyCredit` MODIFY `availableCredit` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `FeePlan` MODIFY `monthlyAmt` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `yearlyAmt` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `FeePlanBreakup` MODIFY `amount` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `MYAALInvoices` MODIFY `amount` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `paidAmount` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `PaySlip` MODIFY `amount` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `SalaryPaymentRecord` MODIFY `paidAmount` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `SalaryPlan` MODIFY `monthlySalary` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `yearlySalary` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `monthlydeductables` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `SalaryPlanBreakup` MODIFY `amount` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `StockProduct` MODIFY `purchasePrice` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `sellPrice` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `Transactions` MODIFY `amount` DOUBLE NOT NULL DEFAULT 0.0;
