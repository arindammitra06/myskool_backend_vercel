-- AlterTable
ALTER TABLE `Theme` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Theme` ADD CONSTRAINT `Theme_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
