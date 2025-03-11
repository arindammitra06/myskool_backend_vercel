/*
  Warnings:

  - You are about to drop the column `isCreated` on the `RequestParentAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `RequestParentAccount` DROP COLUMN `isCreated`,
    ADD COLUMN `approvalStatus` ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'Pending';
