/*
  Warnings:

  - You are about to alter the column `totalLoan` on the `EmployeeLoan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `monthlyAmt` on the `EmployeeLoan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `remainingSum` on the `EmployeeLoan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `LoanDetails` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `EmployeeLoan` MODIFY `totalLoan` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    MODIFY `monthlyAmt` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    MODIFY `remainingSum` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `LoanDetails` MODIFY `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `Transactions` MODIFY `amount` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;
