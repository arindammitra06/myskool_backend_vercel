/*
  Warnings:

  - You are about to drop the column `rating_from` on the `StudentRatings` table. All the data in the column will be lost.
  - You are about to drop the `StudentRatingsAudit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ratingFrom` to the `StudentRatings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `StudentRatings` DROP FOREIGN KEY `StudentRatings_userId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentRatingsAudit` DROP FOREIGN KEY `StudentRatingsAudit_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentRatingsAudit` DROP FOREIGN KEY `StudentRatingsAudit_ratingId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentRatingsAudit` DROP FOREIGN KEY `StudentRatingsAudit_userId_fkey`;

-- AlterTable
ALTER TABLE `StudentRatings` DROP COLUMN `rating_from`,
    ADD COLUMN `classId` INTEGER NULL,
    ADD COLUMN `previousComments` LONGTEXT NULL,
    ADD COLUMN `previousRating` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `ratingFrom` INTEGER NOT NULL,
    ADD COLUMN `sectionId` INTEGER NULL;

-- DropTable
DROP TABLE `StudentRatingsAudit`;

-- AddForeignKey
ALTER TABLE `StudentRatings` ADD CONSTRAINT `StudentRatings_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRatings` ADD CONSTRAINT `StudentRatings_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRatings` ADD CONSTRAINT `StudentRatings_ratingFrom_fkey` FOREIGN KEY (`ratingFrom`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
