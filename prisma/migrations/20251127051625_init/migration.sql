-- DropForeignKey
ALTER TABLE `AdmissionRecord` DROP FOREIGN KEY `AdmissionRecord_studentId_fkey`;

-- DropIndex
DROP INDEX `AdmissionRecord_studentId_fkey` ON `AdmissionRecord`;

-- AlterTable
ALTER TABLE `AdmissionRecord` MODIFY `studentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `AdmissionRecord` ADD CONSTRAINT `AdmissionRecord_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `AdmissionRequestUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
