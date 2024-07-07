/*
  Warnings:

  - You are about to drop the column `classId` on the `EmailHistory` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `EmailHistory` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `EmailHistory` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `EmailHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `EmailHistory` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `SMSHistory` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `SMSHistory` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `SMSHistory` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `SMSHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SMSHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `EmailHistory` DROP FOREIGN KEY `EmailHistory_classId_fkey`;

-- DropForeignKey
ALTER TABLE `EmailHistory` DROP FOREIGN KEY `EmailHistory_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `EmailHistory` DROP FOREIGN KEY `EmailHistory_userId_fkey`;

-- DropForeignKey
ALTER TABLE `SMSHistory` DROP FOREIGN KEY `SMSHistory_classId_fkey`;

-- DropForeignKey
ALTER TABLE `SMSHistory` DROP FOREIGN KEY `SMSHistory_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `SMSHistory` DROP FOREIGN KEY `SMSHistory_userId_fkey`;

-- AlterTable
ALTER TABLE `EmailHistory` DROP COLUMN `classId`,
    DROP COLUMN `sectionId`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `updated_by`,
    DROP COLUMN `userId`,
    ADD COLUMN `body` LONGTEXT NULL,
    ADD COLUMN `name` VARCHAR(255) NULL,
    ADD COLUMN `subject` VARCHAR(255) NULL,
    ADD COLUMN `tos` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `SMSHistory` DROP COLUMN `classId`,
    DROP COLUMN `sectionId`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `updated_by`,
    DROP COLUMN `userId`,
    ADD COLUMN `body` LONGTEXT NULL,
    ADD COLUMN `name` VARCHAR(255) NULL,
    ADD COLUMN `tos` VARCHAR(255) NULL;
