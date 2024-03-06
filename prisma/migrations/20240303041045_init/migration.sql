-- AlterTable
ALTER TABLE `MenuCategoryPermissions` ADD COLUMN `campusId` INTEGER NULL;

-- AlterTable
ALTER TABLE `MenuItemPermissions` ADD COLUMN `campusId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Permission` ADD COLUMN `campusId` INTEGER NULL;

-- AlterTable
ALTER TABLE `UserPermission` ADD COLUMN `campusId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuCategoryPermissions` ADD CONSTRAINT `MenuCategoryPermissions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItemPermissions` ADD CONSTRAINT `MenuItemPermissions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
