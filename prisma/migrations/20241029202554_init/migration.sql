/*
  Warnings:

  - Added the required column `campusId` to the `Sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endMonth` to the `Sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endYear` to the `Sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMonth` to the `Sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startYear` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Sessions` ADD COLUMN `campusId` INTEGER NOT NULL,
    ADD COLUMN `endMonth` INTEGER NOT NULL,
    ADD COLUMN `endYear` INTEGER NOT NULL,
    ADD COLUMN `startMonth` INTEGER NOT NULL,
    ADD COLUMN `startYear` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
