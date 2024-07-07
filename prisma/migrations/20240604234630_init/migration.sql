/*
  Warnings:

  - You are about to drop the column `classId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Attendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_classId_fkey`;

-- DropForeignKey
ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_sectionId_fkey`;

-- AlterTable
ALTER TABLE `Attendance` DROP COLUMN `classId`,
    DROP COLUMN `sectionId`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `updated_by`,
    ADD COLUMN `notes` LONGTEXT NULL,
    ADD COLUMN `recordTime` VARCHAR(255) NULL,
    ADD COLUMN `userType` ENUM('admin', 'student', 'staff', 'parent', 'accountant') NOT NULL DEFAULT 'student',
    MODIFY `attendanceDate` DATE NULL;
