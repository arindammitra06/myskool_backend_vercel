-- CreateTable
CREATE TABLE `Engagements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
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
CREATE TABLE `StudentToEngagements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `engagementId` INTEGER NULL,
    `userId` INTEGER NULL,
    `completed` TINYINT NOT NULL DEFAULT 0,
    `rating` DOUBLE NOT NULL DEFAULT 0.0,
    `comments` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Engagements` ADD CONSTRAINT `Engagements_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Engagements` ADD CONSTRAINT `Engagements_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToEngagements` ADD CONSTRAINT `StudentToEngagements_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToEngagements` ADD CONSTRAINT `StudentToEngagements_engagementId_fkey` FOREIGN KEY (`engagementId`) REFERENCES `Engagements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToEngagements` ADD CONSTRAINT `StudentToEngagements_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
