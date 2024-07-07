/*
  Warnings:

  - You are about to drop the `StudentDues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentInvoices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `StudentDues` DROP FOREIGN KEY `StudentDues_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentDues` DROP FOREIGN KEY `StudentDues_classId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentDues` DROP FOREIGN KEY `StudentDues_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentDues` DROP FOREIGN KEY `StudentDues_userId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentInvoices` DROP FOREIGN KEY `StudentInvoices_campusId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentInvoices` DROP FOREIGN KEY `StudentInvoices_classId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentInvoices` DROP FOREIGN KEY `StudentInvoices_sectionId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentInvoices` DROP FOREIGN KEY `StudentInvoices_userId_fkey`;

-- DropTable
DROP TABLE `StudentDues`;

-- DropTable
DROP TABLE `StudentInvoices`;

-- CreateTable
CREATE TABLE `MonthlyInvoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
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

-- CreateTable
CREATE TABLE `YearlyInvoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
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

-- CreateTable
CREATE TABLE `AdhocInvoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
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

-- CreateTable
CREATE TABLE `LateFeeInvoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `feeStatus` ENUM('Paid', 'Unpaid', 'Partial', 'Cancelled') NOT NULL DEFAULT 'Unpaid',
    `amount` INTEGER NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MonthlyInvoices` ADD CONSTRAINT `MonthlyInvoices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MonthlyInvoices` ADD CONSTRAINT `MonthlyInvoices_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MonthlyInvoices` ADD CONSTRAINT `MonthlyInvoices_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MonthlyInvoices` ADD CONSTRAINT `MonthlyInvoices_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YearlyInvoices` ADD CONSTRAINT `YearlyInvoices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YearlyInvoices` ADD CONSTRAINT `YearlyInvoices_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YearlyInvoices` ADD CONSTRAINT `YearlyInvoices_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YearlyInvoices` ADD CONSTRAINT `YearlyInvoices_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdhocInvoices` ADD CONSTRAINT `AdhocInvoices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdhocInvoices` ADD CONSTRAINT `AdhocInvoices_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdhocInvoices` ADD CONSTRAINT `AdhocInvoices_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdhocInvoices` ADD CONSTRAINT `AdhocInvoices_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LateFeeInvoices` ADD CONSTRAINT `LateFeeInvoices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LateFeeInvoices` ADD CONSTRAINT `LateFeeInvoices_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LateFeeInvoices` ADD CONSTRAINT `LateFeeInvoices_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LateFeeInvoices` ADD CONSTRAINT `LateFeeInvoices_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
