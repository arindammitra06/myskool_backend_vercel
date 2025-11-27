/*
  Warnings:

  - You are about to drop the column `rollNumber` on the `AdmissionRecord` table. All the data in the column will be lost.
  - You are about to drop the column `admissionStatus` on the `AdmissionRequestUser` table. All the data in the column will be lost.
  - You are about to drop the column `applicationDate` on the `AdmissionRequestUser` table. All the data in the column will be lost.
  - You are about to drop the column `applicationStatus` on the `AdmissionRequestUser` table. All the data in the column will be lost.
  - You are about to drop the column `interviewDate` on the `AdmissionRequestUser` table. All the data in the column will be lost.
  - You are about to drop the column `interviewStatus` on the `AdmissionRequestUser` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `AdmissionRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AdmissionRecord` DROP COLUMN `rollNumber`,
    ADD COLUMN `admissionStatus` ENUM('New', 'Initiate', 'UnAssigned', 'Assigned', 'InReview', 'Processing', 'Approved', 'Passed', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'New',
    ADD COLUMN `applicationDate` DATE NULL,
    ADD COLUMN `applicationStatus` ENUM('New', 'Initiate', 'UnAssigned', 'Assigned', 'InReview', 'Processing', 'Approved', 'Passed', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'Initiate',
    ADD COLUMN `interviewDate` DATE NULL,
    ADD COLUMN `interviewStatus` ENUM('New', 'Initiate', 'UnAssigned', 'Assigned', 'InReview', 'Processing', 'Approved', 'Passed', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'UnAssigned',
    ADD COLUMN `studentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `AdmissionRequestUser` DROP COLUMN `admissionStatus`,
    DROP COLUMN `applicationDate`,
    DROP COLUMN `applicationStatus`,
    DROP COLUMN `interviewDate`,
    DROP COLUMN `interviewStatus`;

-- AddForeignKey
ALTER TABLE `AdmissionRecord` ADD CONSTRAINT `AdmissionRecord_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `AdmissionRequestUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
