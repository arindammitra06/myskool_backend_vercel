-- AlterTable
ALTER TABLE `Transactions` ADD COLUMN `employeeLoanId` INTEGER NULL,
    MODIFY `source` ENUM('StudentFeePayment', 'StaffSalaryPayment', 'FamilyCreditAdded', 'StudentFeePaymentUsingFamilyCredit', 'NewLoanToEmployee', 'LoanPaymentByEmployee') NOT NULL DEFAULT 'StudentFeePayment';

-- CreateTable
CREATE TABLE `EmployeeLoan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loanAccountId` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `totalLoan` INTEGER NOT NULL DEFAULT 0,
    `monthlyAmt` INTEGER NOT NULL DEFAULT 0,
    `remainingSum` INTEGER NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_employeeLoanId_fkey` FOREIGN KEY (`employeeLoanId`) REFERENCES `EmployeeLoan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeLoan` ADD CONSTRAINT `EmployeeLoan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeLoan` ADD CONSTRAINT `EmployeeLoan_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
