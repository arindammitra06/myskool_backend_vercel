-- AlterTable
ALTER TABLE `SalaryPlan` ADD COLUMN `yearlySalary` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `SalaryPlanBreakup` ADD COLUMN `isYearly` TINYINT NOT NULL DEFAULT 0;
