/*
  Warnings:

  - You are about to drop the column `year` on the `Holidays` table. All the data in the column will be lost.
  - You are about to drop the column `sessionStartMonth` on the `Institute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `AdmissionRecord` ADD COLUMN `ongoingSessionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Holidays` DROP COLUMN `year`,
    ADD COLUMN `ongoingSessionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Institute` DROP COLUMN `sessionStartMonth`;

-- AlterTable
ALTER TABLE `TimeTable` ADD COLUMN `ongoingSessionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `AdmissionRecord` ADD CONSTRAINT `AdmissionRecord_ongoingSessionId_fkey` FOREIGN KEY (`ongoingSessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_ongoingSessionId_fkey` FOREIGN KEY (`ongoingSessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holidays` ADD CONSTRAINT `Holidays_ongoingSessionId_fkey` FOREIGN KEY (`ongoingSessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
