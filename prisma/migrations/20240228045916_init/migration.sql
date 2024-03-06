/*
  Warnings:

  - You are about to drop the `TeachersForSubjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TeachersForSubjects` DROP FOREIGN KEY `TeachersForSubjects_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `TeachersForSubjects` DROP FOREIGN KEY `TeachersForSubjects_teacherId_fkey`;

-- DropTable
DROP TABLE `TeachersForSubjects`;
