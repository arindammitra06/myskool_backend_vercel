/*
  Warnings:

  - You are about to drop the column `sessionYearRange` on the `Institute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Institute` DROP COLUMN `sessionYearRange`,
    ADD COLUMN `feeDuesDays` INTEGER NULL,
    ADD COLUMN `instituteCode` VARCHAR(255) NULL,
    ADD COLUMN `sessionId` INTEGER NULL,
    ADD COLUMN `sessionStartMonth` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `Sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Institute` ADD CONSTRAINT `Institute_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
