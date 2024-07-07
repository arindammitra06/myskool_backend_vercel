-- AlterTable
ALTER TABLE `EmailTemplate` ADD COLUMN `keywords` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `SMSTemplate` ADD COLUMN `keywords` VARCHAR(500) NULL;
