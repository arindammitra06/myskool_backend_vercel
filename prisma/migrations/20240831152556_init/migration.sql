-- CreateTable
CREATE TABLE `LoanDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `LoanId` VARCHAR(255) NOT NULL,
    `employeeLoanId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LoanDetails` ADD CONSTRAINT `LoanDetails_employeeLoanId_fkey` FOREIGN KEY (`employeeLoanId`) REFERENCES `EmployeeLoan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanDetails` ADD CONSTRAINT `LoanDetails_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
