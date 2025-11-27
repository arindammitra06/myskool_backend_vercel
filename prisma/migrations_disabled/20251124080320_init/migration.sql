-- CreateTable
CREATE TABLE `AdmissionRequestUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userType` ENUM('admin', 'student', 'staff', 'parent', 'accountant') NOT NULL DEFAULT 'student',
    `firstName` VARCHAR(255) NOT NULL,
    `middleName` VARCHAR(255) NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `displayName` VARCHAR(255) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Others') NOT NULL DEFAULT 'Male',
    `dateOfBirth` DATE NULL,
    `placeOfBirth` VARCHAR(255) NULL,
    `photo` VARCHAR(4000) NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `campusId` INTEGER NOT NULL,
    `sessionId` INTEGER NOT NULL,
    `homeAddress` VARCHAR(500) NULL,
    `idCardNumber` VARCHAR(255) NOT NULL,
    `classId` INTEGER NULL,
    `routeId` INTEGER NULL,
    `previousSchool` VARCHAR(255) NULL,
    `citizenship` VARCHAR(255) NULL,
    `admissionDate` DATE NULL,
    `email` VARCHAR(255) NULL,
    `mobile` VARCHAR(255) NULL,
    `CNIC` VARCHAR(255) NULL,
    `religion` VARCHAR(255) NULL,
    `annualIncome` VARCHAR(255) NULL,
    `parentType` ENUM('NA_PARENTTYPE', 'Aunt', 'BrotherInLaw', 'Cousin', 'Daughter', 'DaughterInLaw', 'Father', 'FatherInLaw', 'GrandFather', 'GrandMother', 'Husband', 'LegalGuardian', 'Mother', 'MotherInLaw', 'Nephew', 'Sister', 'SisterInLaw', 'Son', 'SonInLaw', 'Uncle', 'Wife') NULL DEFAULT 'NA_PARENTTYPE',
    `profession` VARCHAR(255) NULL,
    `applicationStatus` ENUM('New', 'Initiate', 'UnAssigned', 'Assigned', 'InReview', 'Processing', 'Approved', 'Passed', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'Initiate',
    `applicationDate` DATE NULL,
    `interviewStatus` ENUM('New', 'Initiate', 'UnAssigned', 'Assigned', 'InReview', 'Processing', 'Approved', 'Passed', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'UnAssigned',
    `interviewDate` DATE NULL,
    `admissionStatus` ENUM('New', 'Initiate', 'UnAssigned', 'Assigned', 'InReview', 'Processing', 'Approved', 'Passed', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'New',
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `AdmissionRequestUser_idCardNumber_key`(`idCardNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserParentChild` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserParentChild_AB_unique`(`A`, `B`),
    INDEX `_UserParentChild_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AdmissionRequestUser` ADD CONSTRAINT `AdmissionRequestUser_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRequestUser` ADD CONSTRAINT `AdmissionRequestUser_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserParentChild` ADD CONSTRAINT `_UserParentChild_A_fkey` FOREIGN KEY (`A`) REFERENCES `AdmissionRequestUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserParentChild` ADD CONSTRAINT `_UserParentChild_B_fkey` FOREIGN KEY (`B`) REFERENCES `AdmissionRequestUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
