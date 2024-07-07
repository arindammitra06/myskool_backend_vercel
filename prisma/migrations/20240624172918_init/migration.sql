-- AlterTable
ALTER TABLE `StudentInvoices` MODIFY `feeStatus` ENUM('Paid', 'Unpaid', 'Partial', 'Cancelled') NOT NULL DEFAULT 'Unpaid';
