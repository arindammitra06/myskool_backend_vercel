/*
  Warnings:

  - You are about to drop the column `recordTime` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Attendance` DROP COLUMN `recordTime`,
    ADD COLUMN `dayStatus` ENUM('FullDay', 'HalfDay') NOT NULL DEFAULT 'FullDay',
    ADD COLUMN `entryStatus` ENUM('UnMarked', 'OnTime', 'Late', 'LeftEarly') NOT NULL DEFAULT 'UnMarked',
    ADD COLUMN `recordEndTime` VARCHAR(255) NULL,
    ADD COLUMN `recordStartTime` VARCHAR(255) NULL;
