-- DropForeignKey
ALTER TABLE `GeneratedDocument` DROP FOREIGN KEY `GeneratedDocument_templateId_fkey`;

-- DropForeignKey
ALTER TABLE `TemplateMaster` DROP FOREIGN KEY `TemplateMaster_pdfId_fkey`;

-- DropIndex
DROP INDEX `GeneratedDocument_templateId_fkey` ON `GeneratedDocument`;

-- DropIndex
DROP INDEX `TemplateMaster_pdfId_fkey` ON `TemplateMaster`;

-- AlterTable
ALTER TABLE `GeneratedDocument` MODIFY `templateId` INTEGER NULL;

-- AlterTable
ALTER TABLE `TemplateMaster` MODIFY `pdfId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `TemplateMaster` ADD CONSTRAINT `TemplateMaster_pdfId_fkey` FOREIGN KEY (`pdfId`) REFERENCES `PdfTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GeneratedDocument` ADD CONSTRAINT `GeneratedDocument_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `PdfTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
