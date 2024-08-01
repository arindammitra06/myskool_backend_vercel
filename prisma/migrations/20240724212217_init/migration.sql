-- AlterTable
ALTER TABLE `Transactions` MODIFY `source` ENUM('StudentFeePayment', 'StaffSalaryPayment', 'FamilyCreditAdded', 'StudentFeePaymentUsingFamilyCredit') NOT NULL DEFAULT 'StudentFeePayment';
