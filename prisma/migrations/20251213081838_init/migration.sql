-- CreateTable
CREATE TABLE `DailyNotes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `notesType` ENUM('Health', 'Food', 'Miscellaneous') NOT NULL DEFAULT 'Miscellaneous',
    `notesDate` DATE NULL,
    `notes` LONGTEXT NULL,
    `studentId` INTEGER NOT NULL,
    `teacherId` INTEGER NOT NULL,
    `ongoingSession` INTEGER NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyNotes` ADD CONSTRAINT `DailyNotes_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyNotes` ADD CONSTRAINT `DailyNotes_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyNotes` ADD CONSTRAINT `DailyNotes_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyNotes` ADD CONSTRAINT `DailyNotes_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyNotes` ADD CONSTRAINT `DailyNotes_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyNotes` ADD CONSTRAINT `DailyNotes_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
