-- AlterTable
ALTER TABLE `User` ADD COLUMN `onlineClassesId` INTEGER NULL;

-- CreateTable
CREATE TABLE `OnlineClasses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classTopic` VARCHAR(255) NOT NULL,
    `classId` INTEGER NOT NULL,
    `sectionId` INTEGER NOT NULL,
    `meetingDateTime` VARCHAR(255) NULL,
    `campusId` INTEGER NOT NULL,
    `isPast` TINYINT NOT NULL DEFAULT 1,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_onlineClassesId_fkey` FOREIGN KEY (`onlineClassesId`) REFERENCES `OnlineClasses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineClasses` ADD CONSTRAINT `OnlineClasses_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineClasses` ADD CONSTRAINT `OnlineClasses_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineClasses` ADD CONSTRAINT `OnlineClasses_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
