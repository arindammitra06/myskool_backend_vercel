/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Holidays` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `TimeTable` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Holidays` DROP FOREIGN KEY `Holidays_sessionId_fkey`;

-- DropForeignKey
ALTER TABLE `TimeTable` DROP FOREIGN KEY `TimeTable_sessionId_fkey`;

-- AlterTable
ALTER TABLE `Holidays` DROP COLUMN `sessionId`;

-- AlterTable
ALTER TABLE `TimeTable` DROP COLUMN `sessionId`;
