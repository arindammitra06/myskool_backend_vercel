/*
  Warnings:

  - You are about to alter the column `purchasePrice` on the `StockProduct` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.
  - You are about to alter the column `sellPrice` on the `StockProduct` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `StockProduct` MODIFY `purchasePrice` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    MODIFY `sellPrice` DECIMAL(65, 30) NOT NULL DEFAULT 0.0;
