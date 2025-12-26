/*
  Warnings:

  - Added the required column `badgeId` to the `StudentBadge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StudentBadge` ADD COLUMN `badgeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `StudentBadge` ADD CONSTRAINT `StudentBadge_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `Badge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
