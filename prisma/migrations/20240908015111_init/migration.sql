/*
  Warnings:

  - Added the required column `created_by` to the `AccessPermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `AccessPermission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AccessPermission` ADD COLUMN `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `updated_by` INTEGER NOT NULL;
