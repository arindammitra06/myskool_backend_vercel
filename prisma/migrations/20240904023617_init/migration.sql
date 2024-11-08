-- DropForeignKey
ALTER TABLE `TimeTable` DROP FOREIGN KEY `TimeTable_classId_fkey`;

-- DropForeignKey
ALTER TABLE `TimeTable` DROP FOREIGN KEY `TimeTable_sectionId_fkey`;

-- AlterTable
ALTER TABLE `TimeTable` MODIFY `classId` INTEGER NULL,
    MODIFY `sectionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
