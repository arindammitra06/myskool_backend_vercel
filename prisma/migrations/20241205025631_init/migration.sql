/*
  Warnings:

  - You are about to drop the column `overallRemarksId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `subjectLevelRemarksId` on the `SubjectMarksTimeTable` table. All the data in the column will be lost.
  - You are about to drop the `TeacherRemarks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Result` DROP FOREIGN KEY `Result_overallRemarksId_fkey`;

-- DropForeignKey
ALTER TABLE `SubjectMarksTimeTable` DROP FOREIGN KEY `SubjectMarksTimeTable_subjectLevelRemarksId_fkey`;

-- DropForeignKey
ALTER TABLE `TeacherRemarks` DROP FOREIGN KEY `TeacherRemarks_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `TeacherRemarks` DROP FOREIGN KEY `TeacherRemarks_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `TeacherRemarks` DROP FOREIGN KEY `TeacherRemarks_teacherId_fkey`;

-- AlterTable
ALTER TABLE `Result` DROP COLUMN `overallRemarksId`,
    ADD COLUMN `overallRemarks` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SubjectMarksTimeTable` DROP COLUMN `subjectLevelRemarksId`,
    ADD COLUMN `remarks` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `TeacherRemarks`;
