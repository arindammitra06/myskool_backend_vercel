-- AlterTable
ALTER TABLE `BehaviourLog` ADD COLUMN `ongoingSession` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `BehaviourLog` ADD CONSTRAINT `BehaviourLog_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
