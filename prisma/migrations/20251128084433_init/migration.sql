-- AlterTable
ALTER TABLE `MYAALInvoices` ADD COLUMN `ongoingSession` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
