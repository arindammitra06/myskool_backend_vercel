/*
  Warnings:

  - You are about to alter the column `availableCredit` on the `FamilyCredit` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `monthlyAmt` on the `FeePlan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `yearlyAmt` on the `FeePlan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `FeePlanBreakup` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `MYAALInvoices` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `paidAmount` on the `MYAALInvoices` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `FamilyCredit` MODIFY `availableCredit` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `FeePlan` MODIFY `monthlyAmt` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    MODIFY `yearlyAmt` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `FeePlanBreakup` MODIFY `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `MYAALInvoices` MODIFY `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    MODIFY `paidAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;
