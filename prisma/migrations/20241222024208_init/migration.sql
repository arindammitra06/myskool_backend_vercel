-- DropForeignKey
ALTER TABLE `EmailHistory` DROP FOREIGN KEY `EmailHistory_emailTemplateId_fkey`;

-- DropIndex
DROP INDEX `EmailHistory_emailTemplateId_fkey` ON `EmailHistory`;

-- AlterTable
ALTER TABLE `EmailHistory` MODIFY `emailTemplateId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `EmailHistory` ADD CONSTRAINT `EmailHistory_emailTemplateId_fkey` FOREIGN KEY (`emailTemplateId`) REFERENCES `EmailTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
