/*
  Warnings:

  - You are about to drop the column `campusId` on the `MenuCategoryPermissions` table. All the data in the column will be lost.
  - You are about to drop the column `campusId` on the `MenuItemPermissions` table. All the data in the column will be lost.
  - You are about to drop the column `campusId` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `campusId` on the `UserPermission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `MenuCategoryPermissions` DROP FOREIGN KEY `MenuCategoryPermissions_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `MenuItemPermissions` DROP FOREIGN KEY `MenuItemPermissions_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `Permission` DROP FOREIGN KEY `Permission_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `UserPermission` DROP FOREIGN KEY `UserPermission_campusId_fkey`;

-- AlterTable
ALTER TABLE `MenuCategoryPermissions` DROP COLUMN `campusId`;

-- AlterTable
ALTER TABLE `MenuItemPermissions` DROP COLUMN `campusId`;

-- AlterTable
ALTER TABLE `Permission` DROP COLUMN `campusId`;

-- AlterTable
ALTER TABLE `UserPermission` DROP COLUMN `campusId`;
