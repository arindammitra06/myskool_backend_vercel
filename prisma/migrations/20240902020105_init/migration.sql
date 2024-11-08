-- AlterTable
ALTER TABLE `MYAALInvoices` MODIFY `paymentType` ENUM('Cash', 'Cheque', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash';

-- AlterTable
ALTER TABLE `SalaryPaymentRecord` MODIFY `paymentType` ENUM('Cash', 'Cheque', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash';

-- AlterTable
ALTER TABLE `Transactions` MODIFY `paymentType` ENUM('Cash', 'Cheque', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash';
