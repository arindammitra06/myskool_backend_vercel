/*
  Warnings:

  - You are about to drop the column `paramMap` on the `PdfTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `PdfTemplate` DROP COLUMN `paramMap`,
    ADD COLUMN `dataQuery` VARCHAR(191) NOT NULL DEFAULT '';
