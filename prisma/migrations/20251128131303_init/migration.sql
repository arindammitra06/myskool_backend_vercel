-- CreateTable
CREATE TABLE `StudentFeesAudit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentFeesId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `feePlanId` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ongoingSession` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_studentFeesId_fkey` FOREIGN KEY (`studentFeesId`) REFERENCES `StudentFees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_feePlanId_fkey` FOREIGN KEY (`feePlanId`) REFERENCES `FeePlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
