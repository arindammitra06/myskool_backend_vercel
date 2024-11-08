/*
  Warnings:

  - Added the required column `soldToId` to the `SellDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SellDetails` ADD COLUMN `soldToId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `SellDetails` ADD CONSTRAINT `SellDetails_soldToId_fkey` FOREIGN KEY (`soldToId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
