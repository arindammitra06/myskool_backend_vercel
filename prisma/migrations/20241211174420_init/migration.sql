/*
  Warnings:

  - You are about to drop the column `day` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Attendance` DROP COLUMN `day`,
    DROP COLUMN `month`,
    DROP COLUMN `year`,
    ADD COLUMN `attendanceDate` DATE NULL,
    ADD COLUMN `className` VARCHAR(191) NULL,
    ADD COLUMN `sectionName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `MYAALInvoices` ADD COLUMN `classId` INTEGER NULL,
    ADD COLUMN `sectionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `StudentFees` ADD COLUMN `classId` INTEGER NULL,
    ADD COLUMN `sectionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Transactions` ADD COLUMN `classId` INTEGER NULL,
    ADD COLUMN `sectionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
