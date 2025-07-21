/*
  Warnings:

  - Added the required column `referenceNo` to the `SalaryPaymentRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendor` to the `SalaryPaymentRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SalaryPaymentRecord` ADD COLUMN `referenceNo` VARCHAR(191) NOT NULL,
    ADD COLUMN `vendor` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `AllBonusInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `financialYearId` INTEGER NULL,
    `paySlipId` INTEGER NULL,
    `userId` INTEGER NULL,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AllBonusInfo` ADD CONSTRAINT `AllBonusInfo_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AllBonusInfo` ADD CONSTRAINT `AllBonusInfo_paySlipId_fkey` FOREIGN KEY (`paySlipId`) REFERENCES `PaySlip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AllBonusInfo` ADD CONSTRAINT `AllBonusInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
