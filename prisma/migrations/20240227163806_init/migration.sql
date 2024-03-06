-- CreateTable
CREATE TABLE `ListOfValues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupName` VARCHAR(255) NOT NULL,
    `uniqueKey` VARCHAR(255) NOT NULL,
    `shortName` VARCHAR(255) NOT NULL,
    `longName` VARCHAR(255) NOT NULL,
    `desc` VARCHAR(255) NOT NULL,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `ListOfValues_uniqueKey_key`(`uniqueKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ListOfValues` ADD CONSTRAINT `ListOfValues_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
