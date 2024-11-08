/*
  Warnings:

  - You are about to drop the column `colorName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `colorName`,
    DROP COLUMN `theme`,
    ADD COLUMN `isUserTheme` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `themeName` VARCHAR(255) NOT NULL DEFAULT 'light';
