-- AlterTable
ALTER TABLE `Institute` ADD COLUMN `financialYearId` INTEGER NULL;

-- AlterTable
ALTER TABLE `PaySlip` ADD COLUMN `financialYearId` INTEGER NULL;

-- CreateTable
CREATE TABLE `FinancialYear` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `financialYear` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxSlabs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `financialYearId` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `regime` ENUM('Old', 'New') NOT NULL DEFAULT 'Old',
    `slab_order` INTEGER NOT NULL,
    `income_min` INTEGER NOT NULL,
    `income_max` INTEGER NOT NULL,
    `tax_rate` DOUBLE NOT NULL DEFAULT 0,
    `fixed_tax` DOUBLE NOT NULL DEFAULT 0,
    `notes` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxRebate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `financialYearId` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `regime` ENUM('Old', 'New') NOT NULL DEFAULT 'Old',
    `max_income` DOUBLE NOT NULL DEFAULT 0,
    `max_rebate` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Institute` ADD CONSTRAINT `Institute_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxSlabs` ADD CONSTRAINT `TaxSlabs_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxRebate` ADD CONSTRAINT `TaxRebate_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaySlip` ADD CONSTRAINT `PaySlip_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
