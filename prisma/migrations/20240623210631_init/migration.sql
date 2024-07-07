-- AlterTable
ALTER TABLE `StudentFees` ADD COLUMN `active` TINYINT NOT NULL DEFAULT 1,
    ADD COLUMN `classId` INTEGER NULL,
    ADD COLUMN `sectionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
