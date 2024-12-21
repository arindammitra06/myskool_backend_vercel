/*
  Warnings:

  - You are about to drop the column `className` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `sectionName` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `StudentFees` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `StudentFees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `StudentFees` DROP FOREIGN KEY `StudentFees_classId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentFees` DROP FOREIGN KEY `StudentFees_sectionId_fkey`;

-- AlterTable
ALTER TABLE `Attendance` DROP COLUMN `className`,
    DROP COLUMN `sectionName`,
    ADD COLUMN `classId` INTEGER NULL,
    ADD COLUMN `sectionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `StudentFees` DROP COLUMN `classId`,
    DROP COLUMN `sectionId`;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
