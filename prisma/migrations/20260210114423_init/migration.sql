-- AlterTable
ALTER TABLE `PaymentGatewayConfig` ADD COLUMN `baseUrl` VARCHAR(191) NULL,
    ADD COLUMN `merchantId` VARCHAR(191) NULL;
