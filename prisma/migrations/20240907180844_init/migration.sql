-- AlterTable
ALTER TABLE `AccessPermission` ADD COLUMN `accessId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `AccessPermission` ADD CONSTRAINT `AccessPermission_accessId_fkey` FOREIGN KEY (`accessId`) REFERENCES `Access`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
