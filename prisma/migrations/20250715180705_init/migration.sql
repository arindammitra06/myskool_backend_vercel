-- CreateTable
CREATE TABLE `BankInformation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `fullName` VARCHAR(255) NULL,
    `bankName` VARCHAR(255) NULL,
    `accountNo` VARCHAR(255) NULL,
    `ifscCode` VARCHAR(255) NULL,
    `type` ENUM('Savings', 'Current', 'NRE') NOT NULL DEFAULT 'Savings',
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BankInformation` ADD CONSTRAINT `BankInformation_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankInformation` ADD CONSTRAINT `BankInformation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
