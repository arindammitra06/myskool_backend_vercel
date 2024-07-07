-- CreateTable
CREATE TABLE `ClassWiseFee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `classId` INTEGER NULL,
    `admissionFee` TINYINT NOT NULL DEFAULT 0,
    `examFee` TINYINT NOT NULL DEFAULT 0,
    `iCard` TINYINT NOT NULL DEFAULT 0,
    `monthlyFee` TINYINT NOT NULL DEFAULT 0,
    `transportFee` TINYINT NOT NULL DEFAULT 0,
    `developmentFee` TINYINT NOT NULL DEFAULT 0,
    `registrationFee` TINYINT NOT NULL DEFAULT 0,
    `dressFee` TINYINT NOT NULL DEFAULT 0,
    `additionalFee` TINYINT NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClassWiseFee` ADD CONSTRAINT `ClassWiseFee_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassWiseFee` ADD CONSTRAINT `ClassWiseFee_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
