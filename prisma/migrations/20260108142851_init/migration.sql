/*
  Warnings:

  - You are about to alter the column `emailProvider` on the `Institute` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(38))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Institute` MODIFY `emailProvider` VARCHAR(191) NULL;
