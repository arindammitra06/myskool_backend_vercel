-- DropForeignKey
ALTER TABLE `TimeTable` DROP FOREIGN KEY `TimeTable_subjectId_fkey`;

-- AlterTable
ALTER TABLE `TimeTable` ADD COLUMN `color` VARCHAR(191) NOT NULL DEFAULT '#A5DD9B',
    ADD COLUMN `subject` VARCHAR(191) NULL,
    MODIFY `subjectId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
