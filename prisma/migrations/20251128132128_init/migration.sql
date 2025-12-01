-- AlterTable
ALTER TABLE `Leaves` ADD COLUMN `ongoingSession` INTEGER NULL;

-- AlterTable
ALTER TABLE `StudentRatings` ADD COLUMN `ongoingSession` INTEGER NULL;

-- AlterTable
ALTER TABLE `StudentToEngagements` ADD COLUMN `ongoingSession` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `StudentToEngagements` ADD CONSTRAINT `StudentToEngagements_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leaves` ADD CONSTRAINT `Leaves_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRatings` ADD CONSTRAINT `StudentRatings_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
