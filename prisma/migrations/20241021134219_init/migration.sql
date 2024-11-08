/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNumber]` on the table `SellDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceNumber` to the `SellDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `SellDetails` DROP FOREIGN KEY `SellDetails_soldToId_fkey`;

-- AlterTable
ALTER TABLE `SellDetails` ADD COLUMN `invoiceNumber` VARCHAR(255) NOT NULL,
    MODIFY `soldToId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `SellDetails_invoiceNumber_key` ON `SellDetails`(`invoiceNumber`);

-- AddForeignKey
ALTER TABLE `SellDetails` ADD CONSTRAINT `SellDetails_soldToId_fkey` FOREIGN KEY (`soldToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
