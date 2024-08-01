-- AlterTable
ALTER TABLE `MYAALInvoices` MODIFY `paymentType` ENUM('Cash', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash';

-- AlterTable
ALTER TABLE `Transactions` MODIFY `paymentType` ENUM('Cash', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash';
