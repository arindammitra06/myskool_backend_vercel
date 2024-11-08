/*
  Warnings:

  - Added the required column `campusId` to the `AccessPermission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AccessPermission` ADD COLUMN `campusId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `AccessPermission` ADD CONSTRAINT `AccessPermission_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
