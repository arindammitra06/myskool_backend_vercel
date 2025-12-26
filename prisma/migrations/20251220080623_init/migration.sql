-- CreateTable
CREATE TABLE `Extracurricular` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` TINYINT NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NULL,
    `details` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentToExtracurricular` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `teacherId` INTEGER NOT NULL,
    `extracurricularId` INTEGER NOT NULL,
    `completed` TINYINT NOT NULL DEFAULT 0,
    `minutes` INTEGER NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `comments` LONGTEXT NULL,
    `proofUrl` TEXT NULL,
    `completedAt` DATETIME(3) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ongoingSession` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentToExtracurricular` ADD CONSTRAINT `StudentToExtracurricular_extracurricularId_fkey` FOREIGN KEY (`extracurricularId`) REFERENCES `Extracurricular`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToExtracurricular` ADD CONSTRAINT `StudentToExtracurricular_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToExtracurricular` ADD CONSTRAINT `StudentToExtracurricular_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToExtracurricular` ADD CONSTRAINT `StudentToExtracurricular_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
