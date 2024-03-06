-- DropIndex
DROP INDEX `Subject_sectionId_fkey` ON `Subject`;

-- AlterTable
ALTER TABLE `Permission` ADD COLUMN `permissionType` ENUM('admin', 'student', 'staff', 'parent', 'accountant') NOT NULL DEFAULT 'student';
