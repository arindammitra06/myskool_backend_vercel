-- CreateTable
CREATE TABLE `RequestParentAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `studentId` INTEGER NULL,
    `parentFullname` VARCHAR(255) NOT NULL,
    `parentEmailId` VARCHAR(255) NOT NULL,
    `parentMobile` VARCHAR(255) NOT NULL,
    `parentGovtId` VARCHAR(255) NOT NULL,
    `parentType` ENUM('NA_PARENTTYPE', 'Aunt', 'BrotherInLaw', 'Cousin', 'Daughter', 'DaughterInLaw', 'Father', 'FatherInLaw', 'GrandFather', 'GrandMother', 'Husband', 'LegalGuardian', 'Mother', 'MotherInLaw', 'Nephew', 'Sister', 'SisterInLaw', 'Son', 'SonInLaw', 'Uncle', 'Wife') NULL DEFAULT 'NA_PARENTTYPE',
    `isCreated` TINYINT NOT NULL DEFAULT 0,
    `reason` VARCHAR(191) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RequestParentAccount` ADD CONSTRAINT `RequestParentAccount_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestParentAccount` ADD CONSTRAINT `RequestParentAccount_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
