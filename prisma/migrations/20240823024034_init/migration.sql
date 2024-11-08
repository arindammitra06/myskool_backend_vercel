-- CreateTable
CREATE TABLE `PaySlip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceNumber` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `slipType` ENUM('MONTHLY', 'YEARLY', 'ADHOC', 'LATE', 'ARREAR') NOT NULL DEFAULT 'MONTHLY',
    `slipStatus` ENUM('Paid', 'Unpaid', 'Partial', 'Cancelled') NOT NULL DEFAULT 'Unpaid',
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `paidAmount` INTEGER NOT NULL DEFAULT 0,
    `paidOn` DATETIME(6) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `PaySlip_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalaryPaymentRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceNumber` VARCHAR(255) NOT NULL,
    `paySlipId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `paymentType` ENUM('Cash', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash',
    `paidAmount` INTEGER NOT NULL DEFAULT 0,
    `paidOn` DATETIME(6) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `SalaryPaymentRecord_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaySlip` ADD CONSTRAINT `PaySlip_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaySlip` ADD CONSTRAINT `PaySlip_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalaryPaymentRecord` ADD CONSTRAINT `SalaryPaymentRecord_paySlipId_fkey` FOREIGN KEY (`paySlipId`) REFERENCES `PaySlip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalaryPaymentRecord` ADD CONSTRAINT `SalaryPaymentRecord_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
