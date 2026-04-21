-- CreateTable
CREATE TABLE `TemplateMaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `templateName` VARCHAR(255) NOT NULL,
    `templateType` VARCHAR(255) NOT NULL,
    `instituteId` INTEGER NOT NULL,
    `pdfId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TemplateMaster` ADD CONSTRAINT `TemplateMaster_instituteId_fkey` FOREIGN KEY (`instituteId`) REFERENCES `Institute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TemplateMaster` ADD CONSTRAINT `TemplateMaster_pdfId_fkey` FOREIGN KEY (`pdfId`) REFERENCES `PdfTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
