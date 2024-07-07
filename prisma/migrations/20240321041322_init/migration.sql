/*
  Warnings:

  - You are about to alter the column `dateOfBirth` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `admissionDate` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.
  - You are about to alter the column `joiningDate` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `dateOfBirth` DATETIME(3) NULL,
    MODIFY `admissionDate` DATETIME(3) NULL,
    MODIFY `joiningDate` DATETIME(3) NULL;
