-- AlterTable
ALTER TABLE `Transactions` MODIFY `source` ENUM('StudentFeePayment', 'StaffSalaryPayment', 'FamilyCreditAdded', 'StudentFeePaymentUsingFamilyCredit', 'NewLoanToEmployee', 'LoanPaymentByEmployee', 'SellProductsFromInventory', 'BuyProductsIntoInventory') NOT NULL DEFAULT 'StudentFeePayment';
