-- DropIndex
DROP INDEX `StudentRatings_userId_fkey` ON `StudentRatings`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `emergencyContact` VARCHAR(255) NULL;
