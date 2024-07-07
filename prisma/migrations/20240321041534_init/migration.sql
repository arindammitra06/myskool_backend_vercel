-- AlterTable
ALTER TABLE `AdmissionRequestOrInquiries` MODIFY `dateOfBirth` DATE NOT NULL,
    MODIFY `admissionDate` DATE NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `dateOfBirth` DATE NULL,
    MODIFY `admissionDate` DATE NULL,
    MODIFY `joiningDate` DATE NULL;
