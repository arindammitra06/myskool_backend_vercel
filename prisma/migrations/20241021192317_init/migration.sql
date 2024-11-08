-- AlterTable
ALTER TABLE `Transactions` ADD COLUMN `sellDetailsId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_sellDetailsId_fkey` FOREIGN KEY (`sellDetailsId`) REFERENCES `SellDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
