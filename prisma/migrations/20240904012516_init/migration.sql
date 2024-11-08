-- AlterTable
ALTER TABLE `Holidays` ADD COLUMN `sessionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Holidays` ADD CONSTRAINT `Holidays_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
