-- CreateTable
CREATE TABLE `StudentSessionHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` TINYINT NOT NULL DEFAULT 1,
    `studentId` INTEGER NOT NULL,
    `displayName` VARCHAR(255) NOT NULL,
    `sessionId` INTEGER NOT NULL,
    `campusId` INTEGER NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `rollNumber` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
