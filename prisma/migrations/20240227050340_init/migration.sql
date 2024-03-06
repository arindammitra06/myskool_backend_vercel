/*
  Warnings:

  - You are about to drop the column `userId` on the `Subject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Subject` DROP FOREIGN KEY `Subject_userId_fkey`;

-- AlterTable
ALTER TABLE `Subject` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `subjectId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
