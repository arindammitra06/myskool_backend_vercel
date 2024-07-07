-- AlterTable
ALTER TABLE `User` ADD COLUMN `resetPasswordCode` VARCHAR(255) NULL,
    ADD COLUMN `resetPasswordFlag` TINYINT NOT NULL DEFAULT 1;
