/*
  Warnings:

  - You are about to drop the column `classId` on the `Leaves` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Leaves` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Leaves` DROP FOREIGN KEY `Leaves_classId_fkey`;

-- DropForeignKey
ALTER TABLE `Leaves` DROP FOREIGN KEY `Leaves_sectionId_fkey`;

-- AlterTable
ALTER TABLE `Leaves` DROP COLUMN `classId`,
    DROP COLUMN `sectionId`;
