-- CreateTable
CREATE TABLE `PdfTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `type` VARCHAR(191) NOT NULL,
    `templateJson` JSON NOT NULL,
    `paramMap` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneratedDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `templateId` INTEGER NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL DEFAULT 'application/pdf',
    `pdfData` LONGBLOB NOT NULL,
    `createdBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GeneratedDocument` ADD CONSTRAINT `GeneratedDocument_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `PdfTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GeneratedDocument` ADD CONSTRAINT `GeneratedDocument_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
