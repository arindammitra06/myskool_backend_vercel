/*
  Warnings:

  - You are about to alter the column `holidayStart` on the `Holidays` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Date`.
  - You are about to alter the column `holidayEnd` on the `Holidays` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Date`.

*/
-- AlterTable
ALTER TABLE `Holidays` MODIFY `holidayStart` DATE NOT NULL,
    MODIFY `holidayEnd` DATE NOT NULL;
