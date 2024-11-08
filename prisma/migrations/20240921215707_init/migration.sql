/*
  Warnings:

  - You are about to alter the column `totalLoan` on the `EmployeeLoan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `monthlyAmt` on the `EmployeeLoan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `remainingSum` on the `EmployeeLoan` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `amount` on the `LoanDetails` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `EmployeeLoan` MODIFY `totalLoan` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `monthlyAmt` DOUBLE NOT NULL DEFAULT 0.0,
    MODIFY `remainingSum` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `LoanDetails` MODIFY `amount` DOUBLE NOT NULL DEFAULT 0.0;
