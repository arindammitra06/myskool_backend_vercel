/*
  Warnings:

  - You are about to drop the `AdhocInvoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClassWiseFee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LateFeeInvoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MonthlyFee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MonthlyInvoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YearlyInvoices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AdhocInvoices` DROP FOREIGN KEY `AdhocInvoices_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `AdhocInvoices` DROP FOREIGN KEY `AdhocInvoices_classId_fkey`;

-- DropForeignKey
ALTER TABLE `AdhocInvoices` DROP FOREIGN KEY `AdhocInvoices_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `AdhocInvoices` DROP FOREIGN KEY `AdhocInvoices_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ClassWiseFee` DROP FOREIGN KEY `ClassWiseFee_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `ClassWiseFee` DROP FOREIGN KEY `ClassWiseFee_classId_fkey`;

-- DropForeignKey
ALTER TABLE `LateFeeInvoices` DROP FOREIGN KEY `LateFeeInvoices_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `LateFeeInvoices` DROP FOREIGN KEY `LateFeeInvoices_classId_fkey`;

-- DropForeignKey
ALTER TABLE `LateFeeInvoices` DROP FOREIGN KEY `LateFeeInvoices_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `LateFeeInvoices` DROP FOREIGN KEY `LateFeeInvoices_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MonthlyFee` DROP FOREIGN KEY `MonthlyFee_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `MonthlyFee` DROP FOREIGN KEY `MonthlyFee_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MonthlyInvoices` DROP FOREIGN KEY `MonthlyInvoices_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `MonthlyInvoices` DROP FOREIGN KEY `MonthlyInvoices_classId_fkey`;

-- DropForeignKey
ALTER TABLE `MonthlyInvoices` DROP FOREIGN KEY `MonthlyInvoices_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `MonthlyInvoices` DROP FOREIGN KEY `MonthlyInvoices_userId_fkey`;

-- DropForeignKey
ALTER TABLE `YearlyInvoices` DROP FOREIGN KEY `YearlyInvoices_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `YearlyInvoices` DROP FOREIGN KEY `YearlyInvoices_classId_fkey`;

-- DropForeignKey
ALTER TABLE `YearlyInvoices` DROP FOREIGN KEY `YearlyInvoices_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `YearlyInvoices` DROP FOREIGN KEY `YearlyInvoices_userId_fkey`;

-- DropTable
DROP TABLE `AdhocInvoices`;

-- DropTable
DROP TABLE `ClassWiseFee`;

-- DropTable
DROP TABLE `LateFeeInvoices`;

-- DropTable
DROP TABLE `MonthlyFee`;

-- DropTable
DROP TABLE `MonthlyInvoices`;

-- DropTable
DROP TABLE `YearlyInvoices`;

-- CreateTable
CREATE TABLE `MYAALInvoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `feeType` ENUM('MONTHLY', 'YEARLY', 'ADHOC', 'LATE', 'ARREAR') NOT NULL DEFAULT 'MONTHLY',
    `feeStatus` ENUM('Paid', 'Unpaid', 'Partial', 'Cancelled') NOT NULL DEFAULT 'Unpaid',
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `dueDate` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `amount` INTEGER NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
