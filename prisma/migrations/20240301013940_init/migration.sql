-- AlterTable
ALTER TABLE `Subject` ADD COLUMN `sectionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
