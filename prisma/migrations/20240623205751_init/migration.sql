-- AlterTable
ALTER TABLE `StudentInvoices` MODIFY `feeStatus` ENUM('Paid', 'Unpaid', 'Partial') NOT NULL DEFAULT 'Unpaid';
