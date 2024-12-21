/*
  Warnings:

  - You are about to drop the column `attendanceDate` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `MYAALInvoices` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `MYAALInvoices` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `StudentFees` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `StudentFees` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `day` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_classId_fkey`;

-- DropForeignKey
ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `MYAALInvoices` DROP FOREIGN KEY `MYAALInvoices_classId_fkey`;

-- DropForeignKey
ALTER TABLE `MYAALInvoices` DROP FOREIGN KEY `MYAALInvoices_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentFees` DROP FOREIGN KEY `StudentFees_classId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentFees` DROP FOREIGN KEY `StudentFees_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `Transactions` DROP FOREIGN KEY `Transactions_classId_fkey`;

-- DropForeignKey
ALTER TABLE `Transactions` DROP FOREIGN KEY `Transactions_sectionId_fkey`;

-- AlterTable
ALTER TABLE `Attendance` DROP COLUMN `attendanceDate`,
    DROP COLUMN `classId`,
    DROP COLUMN `sectionId`,
    ADD COLUMN `day` INTEGER NOT NULL,
    ADD COLUMN `month` INTEGER NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `MYAALInvoices` DROP COLUMN `classId`,
    DROP COLUMN `sectionId`;

-- AlterTable
ALTER TABLE `StudentFees` DROP COLUMN `classId`,
    DROP COLUMN `sectionId`;

-- AlterTable
ALTER TABLE `Transactions` DROP COLUMN `classId`,
    DROP COLUMN `sectionId`;
