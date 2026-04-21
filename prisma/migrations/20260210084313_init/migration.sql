-- CreateTable
CREATE TABLE `PaymentGatewayConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `provider` ENUM('STRIPE', 'RAZORPAY', 'CASHFREE', 'PHONEPE') NOT NULL,
    `isActive` TINYINT NOT NULL DEFAULT 1,
    `apiKey` VARCHAR(191) NULL,
    `secretKey` VARCHAR(191) NULL,
    `webhookSecret` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `provider` ENUM('STRIPE', 'RAZORPAY', 'CASHFREE', 'PHONEPE') NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `externalOrderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentRequestId` INTEGER NOT NULL,
    `provider` ENUM('STRIPE', 'RAZORPAY', 'CASHFREE', 'PHONEPE') NOT NULL,
    `externalPaymentId` VARCHAR(191) NULL,
    `status` ENUM('INITIATED', 'SUCCESS', 'FAILED') NOT NULL,
    `rawResponse` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Refund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentTransactionId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `reason` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
    `externalRefundId` VARCHAR(191) NULL,
    `rawResponse` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaymentRequest` ADD CONSTRAINT `PaymentRequest_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `MYAALInvoices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentTransaction` ADD CONSTRAINT `PaymentTransaction_paymentRequestId_fkey` FOREIGN KEY (`paymentRequestId`) REFERENCES `PaymentRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_paymentTransactionId_fkey` FOREIGN KEY (`paymentTransactionId`) REFERENCES `PaymentTransaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
