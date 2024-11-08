-- CreateTable
CREATE TABLE `Theme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `themeName` VARCHAR(255) NOT NULL,
    `scheme` VARCHAR(255) NOT NULL,
    `schemeColor` VARCHAR(255) NOT NULL,
    `fontFamily` VARCHAR(255) NOT NULL,
    `fontSize` INTEGER NULL,
    `primaryColor` VARCHAR(255) NOT NULL,
    `actionGreenButton` VARCHAR(255) NOT NULL,
    `secondaryOrangeButton` VARCHAR(255) NOT NULL,
    `blue` VARCHAR(255) NOT NULL,
    `red` VARCHAR(255) NOT NULL,
    `orange` VARCHAR(255) NOT NULL,
    `yellow` VARCHAR(255) NOT NULL,
    `green` VARCHAR(255) NOT NULL,
    `backg` VARCHAR(255) NOT NULL,
    `foreg` VARCHAR(255) NOT NULL,
    `header` VARCHAR(255) NOT NULL,
    `leftmenu` VARCHAR(255) NOT NULL,
    `white` VARCHAR(255) NOT NULL,
    `black` VARCHAR(255) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Theme` ADD CONSTRAINT `Theme_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
