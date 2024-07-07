-- AlterTable
ALTER TABLE `MYAALInvoices` ADD COLUMN `paymentType` ENUM('Cash', 'Online', 'Credit') NOT NULL DEFAULT 'Cash';

-- AlterTable
ALTER TABLE `Transactions` ADD COLUMN `paymentType` ENUM('Cash', 'Online', 'Credit') NOT NULL DEFAULT 'Cash';
