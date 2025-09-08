-- AlterTable
ALTER TABLE `Campus` ADD COLUMN `affilicationNumber` VARCHAR(255) NULL,
    ADD COLUMN `buildingSafetyCertificate` VARCHAR(255) NULL,
    ADD COLUMN `fireSafetyClearanceNumber` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `Institute` ADD COLUMN `adminEmailOrPhone` VARCHAR(255) NULL,
    ADD COLUMN `adminHeadInCharge` VARCHAR(255) NULL,
    ADD COLUMN `affiliation` VARCHAR(255) NULL,
    ADD COLUMN `affilicationNumber` VARCHAR(255) NULL,
    ADD COLUMN `buildingSafetyCertificate` VARCHAR(255) NULL,
    ADD COLUMN `classLevels` VARCHAR(255) NULL,
    ADD COLUMN `curriculumSubjectsOffered` VARCHAR(255) NULL,
    ADD COLUMN `establishmentYear` VARCHAR(255) NULL,
    ADD COLUMN `examinationPattern` VARCHAR(255) NULL,
    ADD COLUMN `fireSafetyClearanceNumber` VARCHAR(255) NULL,
    ADD COLUMN `gradingSystem` VARCHAR(255) NULL,
    ADD COLUMN `mediumOfInstruction` VARCHAR(255) NULL,
    ADD COLUMN `principal` VARCHAR(255) NULL,
    ADD COLUMN `sectionsPerClass` VARCHAR(255) NULL,
    ADD COLUMN `studentTeacherRatio` VARCHAR(255) NULL,
    ADD COLUMN `tagline` VARCHAR(255) NULL,
    ADD COLUMN `vicePrincipal` VARCHAR(255) NULL,
    ADD COLUMN `websiteUrl` VARCHAR(255) NULL,
    ADD COLUMN `workingDays` VARCHAR(255) NULL;
