-- AlterTable
ALTER TABLE `Transactions` ADD COLUMN `familyCreditId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_familyCreditId_fkey` FOREIGN KEY (`familyCreditId`) REFERENCES `FamilyCredit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
