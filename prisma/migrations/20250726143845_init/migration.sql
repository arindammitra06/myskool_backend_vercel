-- AlterTable
ALTER TABLE `Theme` ADD COLUMN `themeType` ENUM('System', 'User') NOT NULL DEFAULT 'System';
