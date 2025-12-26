-- CreateTable
CREATE TABLE `Months` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialYear` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `financialYear` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session` VARCHAR(255) NOT NULL,
    `campusId` INTEGER NOT NULL,
    `endMonth` INTEGER NOT NULL,
    `endYear` INTEGER NOT NULL,
    `startMonth` INTEGER NOT NULL,
    `startYear` INTEGER NOT NULL,

    INDEX `Sessions_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentSessionHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` TINYINT NOT NULL DEFAULT 1,
    `studentId` INTEGER NOT NULL,
    `displayName` VARCHAR(255) NOT NULL,
    `sessionId` INTEGER NOT NULL,
    `campusId` INTEGER NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `rollNumber` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Institute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instituteName` VARCHAR(255) NOT NULL,
    `instituteSignature` VARCHAR(255) NOT NULL,
    `instituteCode` VARCHAR(255) NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `currency` VARCHAR(255) NOT NULL,
    `sessionId` INTEGER NULL,
    `feeDuesDays` INTEGER NULL,
    `allowOnlineClass` INTEGER NOT NULL DEFAULT 0,
    `jitsiAppID` VARCHAR(255) NULL,
    `logo` VARCHAR(255) NOT NULL,
    `headerImage` VARCHAR(255) NOT NULL,
    `schoolLeavingCertId` INTEGER NOT NULL DEFAULT 1,
    `characterCertId` INTEGER NOT NULL DEFAULT 4,
    `dobCertId` INTEGER NOT NULL DEFAULT 6,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `emailApiKey` VARCHAR(255) NULL,
    `emailFromId` VARCHAR(255) NULL,
    `emailFromName` VARCHAR(255) NULL,
    `SMSApiKey` VARCHAR(255) NULL,
    `allowEmail` INTEGER NOT NULL DEFAULT 0,
    `allowSMS` INTEGER NOT NULL DEFAULT 0,
    `financialYearId` INTEGER NULL,
    `themeId` INTEGER NULL,
    `dateTimeFormat` VARCHAR(255) NOT NULL DEFAULT 'MM/DD/YYYY hh:mm A',
    `dateFormat` VARCHAR(255) NOT NULL DEFAULT 'MM/DD/YYYY',
    `tagline` VARCHAR(255) NULL,
    `affiliation` VARCHAR(255) NULL,
    `mediumOfInstruction` VARCHAR(255) NULL,
    `establishmentYear` VARCHAR(255) NULL,
    `websiteUrl` VARCHAR(255) NULL,
    `principal` VARCHAR(255) NULL,
    `vicePrincipal` VARCHAR(255) NULL,
    `adminHeadInCharge` VARCHAR(255) NULL,
    `adminEmailOrPhone` VARCHAR(255) NULL,
    `workingDays` VARCHAR(255) NULL,
    `classLevels` VARCHAR(255) NULL,
    `sectionsPerClass` VARCHAR(255) NULL,
    `curriculumSubjectsOffered` VARCHAR(255) NULL,
    `gradingSystem` VARCHAR(255) NULL,
    `examinationPattern` VARCHAR(255) NULL,
    `affilicationNumber` VARCHAR(255) NULL,
    `fireSafetyClearanceNumber` VARCHAR(255) NULL,
    `buildingSafetyCertificate` VARCHAR(255) NULL,
    `studentTeacherRatio` VARCHAR(255) NULL,

    INDEX `Institute_sessionId_fkey`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusName` VARCHAR(255) NOT NULL,
    `campusAddress` VARCHAR(255) NOT NULL,
    `campusPhone` VARCHAR(255) NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `affilicationNumber` VARCHAR(255) NULL,
    `fireSafetyClearanceNumber` VARCHAR(255) NULL,
    `buildingSafetyCertificate` VARCHAR(255) NULL,
    `instituteId` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `Campus_instituteId_fkey`(`instituteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DefaultImageSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `front` VARCHAR(255) NULL,
    `back` VARCHAR(255) NULL,
    `type` VARCHAR(255) NULL,
    `forUser` VARCHAR(255) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `DefaultImageSetting_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instituteId` INTEGER NOT NULL,
    `bankAccountName` VARCHAR(255) NOT NULL,
    `bankAccountBranch` VARCHAR(255) NOT NULL,
    `bankAccountIFSC` VARCHAR(255) NOT NULL,
    `bankAccountNumber` VARCHAR(255) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `PaymentDetails_instituteId_fkey`(`instituteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransportRoutes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `routeName` VARCHAR(255) NOT NULL,
    `routeDesc` VARCHAR(255) NOT NULL,
    `startAddress` VARCHAR(255) NOT NULL,
    `endAddress` VARCHAR(255) NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `campusId` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `TransportRoutes_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Class` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `className` VARCHAR(255) NOT NULL,
    `numericName` VARCHAR(255) NOT NULL,
    `teacherId` INTEGER NULL,
    `ageOfStudent` INTEGER NULL,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `Class_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionName` VARCHAR(255) NOT NULL,
    `classId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `Section_campusId_fkey`(`campusId`),
    INDEX `Section_classId_fkey`(`classId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeachersInSection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `teacherId` INTEGER NOT NULL,
    `sectionId` INTEGER NOT NULL,

    INDEX `TeachersInSection_campusId_fkey`(`campusId`),
    INDEX `TeachersInSection_sectionId_fkey`(`sectionId`),
    INDEX `TeachersInSection_teacherId_fkey`(`teacherId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
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
    `thumbnailUrl` VARCHAR(4000) NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `campusId` INTEGER NOT NULL,
    `homeAddress` VARCHAR(500) NULL,
    `password` VARCHAR(255) NOT NULL,
    `idCardNumber` VARCHAR(255) NOT NULL,
    `rollNumber` INTEGER NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `routeId` INTEGER NULL,
    `previousSchool` VARCHAR(255) NULL,
    `admissionDate` DATE NULL,
    `email` VARCHAR(255) NULL,
    `mobile` VARCHAR(255) NULL,
    `whatsapp` VARCHAR(255) NULL,
    `empId` VARCHAR(255) NULL,
    `designation` VARCHAR(255) NULL,
    `CNIC` VARCHAR(255) NULL,
    `qualification` VARCHAR(255) NULL,
    `fatherHusbandName` VARCHAR(255) NULL,
    `joiningDate` DATE NULL,
    `maritalStatus` ENUM('NA_MARITALSTATUS', 'Single', 'Married', 'Others') NULL DEFAULT 'NA_MARITALSTATUS',
    `salaryType` ENUM('NA_SALTYPE', 'FullTime', 'PerTime', 'PerHour', 'PerLecture') NULL DEFAULT 'NA_SALTYPE',
    `schoolIdCardNumber` VARCHAR(255) NULL,
    `idProofPhoto` VARCHAR(255) NULL,
    `religion` VARCHAR(255) NULL,
    `citizenship` VARCHAR(255) NULL,
    `parentType` ENUM('NA_PARENTTYPE', 'Aunt', 'BrotherInLaw', 'Cousin', 'Daughter', 'DaughterInLaw', 'Father', 'FatherInLaw', 'GrandFather', 'GrandMother', 'Husband', 'LegalGuardian', 'Mother', 'MotherInLaw', 'Nephew', 'Sister', 'SisterInLaw', 'Son', 'SonInLaw', 'Uncle', 'Wife') NULL DEFAULT 'NA_PARENTTYPE',
    `profession` VARCHAR(255) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `parentsNames` VARCHAR(255) NULL,
    `onlineClassesId` INTEGER NULL,
    `resetPasswordCode` VARCHAR(255) NULL,
    `resetPasswordFlag` TINYINT NOT NULL DEFAULT 1,
    `leftMenuExpanded` TINYINT NOT NULL DEFAULT 1,
    `emergencyContact` VARCHAR(255) NULL,
    `ongoingSession` INTEGER NULL,

    UNIQUE INDEX `User_idCardNumber_key`(`idCardNumber`),
    INDEX `User_campusId_fkey`(`campusId`),
    INDEX `User_classId_fkey`(`classId`),
    INDEX `User_onlineClassesId_fkey`(`onlineClassesId`),
    INDEX `User_routeId_fkey`(`routeId`),
    INDEX `User_sectionId_fkey`(`sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankInformation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `fullName` VARCHAR(255) NULL,
    `bankName` VARCHAR(255) NULL,
    `accountNo` VARCHAR(255) NULL,
    `ifscCode` VARCHAR(255) NULL,
    `type` ENUM('Savings', 'Current', 'NRE') NOT NULL DEFAULT 'Savings',
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParentChildRelation` (
    `parentId` INTEGER NOT NULL,
    `childrenId` INTEGER NOT NULL,

    INDEX `ParentChildRelation_childrenId_fkey`(`childrenId`),
    PRIMARY KEY (`parentId`, `childrenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `AdmissionRequestUser_idCardNumber_key`(`idCardNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `campusId` INTEGER NOT NULL,
    `studentId` INTEGER NULL,
    `applicationStatus` ENUM('New', 'Initiate', 'UnAssigned', 'Assigned', 'InReview', 'Processing', 'Approved', 'Passed', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'Initiate',
    `applicationDate` DATE NULL,
    `interviewStatus` ENUM('New', 'Initiate', 'UnAssigned', 'Assigned', 'InReview', 'Processing', 'Approved', 'Passed', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'UnAssigned',
    `interviewDate` DATE NULL,
    `admissionStatus` ENUM('New', 'Initiate', 'UnAssigned', 'Assigned', 'InReview', 'Processing', 'Approved', 'Passed', 'Completed', 'Failed', 'Cancelled') NOT NULL DEFAULT 'New',
    `admissionComments` VARCHAR(255) NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ongoingSessionId` INTEGER NULL,

    INDEX `AdmissionRecord_campusId_fkey`(`campusId`),
    INDEX `AdmissionRecord_ongoingSessionId_fkey`(`ongoingSessionId`),
    INDEX `AdmissionRecord_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `campusId` INTEGER NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `UserPermission_campusId_fkey`(`campusId`),
    INDEX `UserPermission_permissionId_fkey`(`permissionId`),
    INDEX `UserPermission_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionName` VARCHAR(255) NOT NULL,
    `permissionType` ENUM('admin', 'student', 'staff', 'parent', 'accountant') NOT NULL DEFAULT 'student',
    `isReadonly` TINYINT NOT NULL DEFAULT 1,
    `isMobile` TINYINT NOT NULL DEFAULT 1,
    `active` TINYINT NOT NULL DEFAULT 1,
    `campusId` INTEGER NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `dashboardUrl` VARCHAR(255) NULL,

    INDEX `Permission_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuCategoryPermissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionId` INTEGER NOT NULL,
    `menuCategoryId` INTEGER NOT NULL,
    `campusId` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `MenuCategoryPermissions_campusId_fkey`(`campusId`),
    INDEX `MenuCategoryPermissions_menuCategoryId_fkey`(`menuCategoryId`),
    INDEX `MenuCategoryPermissions_permissionId_fkey`(`permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuCategory` (
    `id` INTEGER NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `route` VARCHAR(255) NULL,
    `orderKey` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `description` VARCHAR(4000) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuItemPermissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionId` INTEGER NOT NULL,
    `menuItemId` INTEGER NOT NULL,
    `campusId` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `MenuItemPermissions_campusId_fkey`(`campusId`),
    INDEX `MenuItemPermissions_menuItemId_fkey`(`menuItemId`),
    INDEX `MenuItemPermissions_permissionId_fkey`(`permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuItems` (
    `id` INTEGER NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `route` VARCHAR(255) NOT NULL,
    `orderKey` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `categoryId` INTEGER NOT NULL,
    `description` VARCHAR(4000) NULL,

    INDEX `MenuItems_categoryId_fkey`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OnlineClasses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classTopic` VARCHAR(255) NOT NULL,
    `classId` INTEGER NOT NULL,
    `sectionId` INTEGER NOT NULL,
    `meetingDateTime` VARCHAR(255) NULL,
    `meetingRoomId` VARCHAR(255) NULL,
    `campusId` INTEGER NOT NULL,
    `isPast` TINYINT NOT NULL DEFAULT 1,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `OnlineClasses_campusId_fkey`(`campusId`),
    INDEX `OnlineClasses_classId_fkey`(`classId`),
    INDEX `OnlineClasses_sectionId_fkey`(`sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `subjectName` VARCHAR(255) NULL,
    `subjectCode` VARCHAR(255) NULL,
    `subjectType` ENUM('Theory', 'Practical', 'Assessment', 'Others') NULL DEFAULT 'Theory',
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `sectionId` INTEGER NULL,

    INDEX `Subject_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `attendanceStatus` ENUM('UnMarked', 'Present', 'Absent', 'Holiday', 'Leave') NOT NULL DEFAULT 'UnMarked',
    `attendanceType` ENUM('Manual', 'Automated') NOT NULL DEFAULT 'Manual',
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `notes` LONGTEXT NULL,
    `userType` ENUM('admin', 'student', 'staff', 'parent', 'accountant') NOT NULL DEFAULT 'student',
    `dayStatus` ENUM('FullDay', 'HalfDay') NOT NULL DEFAULT 'FullDay',
    `entryStatus` ENUM('UnMarked', 'OnTime', 'Late', 'LeftEarly') NOT NULL DEFAULT 'UnMarked',
    `recordEndTime` VARCHAR(255) NULL,
    `recordStartTime` VARCHAR(255) NULL,
    `attendanceDate` DATE NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,

    INDEX `Attendance_campusId_fkey`(`campusId`),
    INDEX `Attendance_classId_fkey`(`classId`),
    INDEX `Attendance_sectionId_fkey`(`sectionId`),
    INDEX `Attendance_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListOfValues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupName` VARCHAR(255) NOT NULL,
    `uniqueKey` VARCHAR(255) NOT NULL,
    `shortName` VARCHAR(255) NOT NULL,
    `longName` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `ListOfValues_uniqueKey_key`(`uniqueKey`),
    INDEX `ListOfValues_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `campusId` INTEGER NOT NULL,
    `subject` VARCHAR(191) NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#A5DD9B',
    `bgcolor` VARCHAR(191) NOT NULL DEFAULT '#A5DD9B',
    `duration` VARCHAR(191) NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `isRecurring` TINYINT NOT NULL DEFAULT 1,
    `day` VARCHAR(191) NULL,
    `startTime` VARCHAR(191) NULL,
    `endTime` VARCHAR(191) NULL,
    `start` VARCHAR(191) NULL,
    `end` VARCHAR(191) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `subjectId` INTEGER NULL,
    `year` VARCHAR(191) NULL,
    `ongoingSessionId` INTEGER NULL,

    INDEX `TimeTable_campusId_fkey`(`campusId`),
    INDEX `TimeTable_classId_fkey`(`classId`),
    INDEX `TimeTable_ongoingSessionId_fkey`(`ongoingSessionId`),
    INDEX `TimeTable_sectionId_fkey`(`sectionId`),
    INDEX `TimeTable_subjectId_fkey`(`subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Holidays` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NULL,
    `holidayStart` VARCHAR(255) NULL,
    `holidayEnd` VARCHAR(255) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ongoingSessionId` INTEGER NULL,

    INDEX `Holidays_campusId_fkey`(`campusId`),
    INDEX `Holidays_classId_fkey`(`classId`),
    INDEX `Holidays_ongoingSessionId_fkey`(`ongoingSessionId`),
    INDEX `Holidays_sectionId_fkey`(`sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionRequestOrInquiries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isFromApp` INTEGER NOT NULL DEFAULT 0,
    `isApproved` VARCHAR(255) NOT NULL DEFAULT 'No',
    `firstName` VARCHAR(255) NOT NULL,
    `middleName` VARCHAR(255) NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `displayName` VARCHAR(255) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Others') NOT NULL DEFAULT 'Male',
    `dateOfBirth` DATE NOT NULL,
    `placeOfBirth` VARCHAR(255) NULL,
    `campusId` INTEGER NOT NULL,
    `location` VARCHAR(500) NULL,
    `previousSchool` VARCHAR(255) NULL,
    `admissionDate` DATE NOT NULL,
    `email` VARCHAR(255) NULL,
    `mobile` VARCHAR(255) NULL,
    `IDorCNIC` VARCHAR(255) NULL,
    `parentFullName` VARCHAR(255) NULL,
    `comments` VARCHAR(255) NULL,
    `classId` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `AdmissionRequestOrInquiries_campusId_fkey`(`campusId`),
    INDEX `AdmissionRequestOrInquiries_classId_fkey`(`classId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReportThemes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupName` VARCHAR(255) NOT NULL,
    `uniqueKey` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `ReportThemes_uniqueKey_key`(`uniqueKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `subject` VARCHAR(255) NULL,
    `body` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `name` VARCHAR(255) NULL,
    `keywords` VARCHAR(500) NULL,
    `isEditable` TINYINT NOT NULL DEFAULT 1,

    INDEX `EmailTemplate_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `emailTemplateId` INTEGER NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `body` LONGTEXT NULL,
    `name` VARCHAR(255) NULL,
    `subject` VARCHAR(255) NULL,
    `tos` VARCHAR(255) NULL,

    INDEX `EmailHistory_campusId_fkey`(`campusId`),
    INDEX `EmailHistory_emailTemplateId_fkey`(`emailTemplateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SMSTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `body` VARCHAR(255) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `name` VARCHAR(255) NULL,
    `keywords` VARCHAR(500) NULL,

    INDEX `SMSTemplate_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SMSHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `smsTemplateId` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `body` LONGTEXT NULL,
    `name` VARCHAR(255) NULL,
    `tos` VARCHAR(255) NULL,

    INDEX `SMSHistory_campusId_fkey`(`campusId`),
    INDEX `SMSHistory_smsTemplateId_fkey`(`smsTemplateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `markedRead` TINYINT NOT NULL DEFAULT 0,
    `message` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `Notifications_campusId_fkey`(`campusId`),
    INDEX `Notifications_created_by_fkey`(`created_by`),
    INDEX `Notifications_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NoticeBoard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NULL,
    `message` LONGTEXT NULL,
    `messageType` ENUM('INFO', 'WARN', 'ERROR') NOT NULL DEFAULT 'INFO',
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `NoticeBoard_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyHomework` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `homeworkDate` DATE NULL,
    `homeworkData` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `DailyHomework_campusId_fkey`(`campusId`),
    INDEX `DailyHomework_classId_fkey`(`classId`),
    INDEX `DailyHomework_sectionId_fkey`(`sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Engagements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NULL,
    `details` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `Engagements_campusId_fkey`(`campusId`),
    INDEX `Engagements_classId_fkey`(`classId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentToEngagements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `engagementId` INTEGER NULL,
    `userId` INTEGER NULL,
    `completed` TINYINT NOT NULL DEFAULT 0,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `comments` LONGTEXT NULL,
    `response` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ongoingSession` INTEGER NULL,

    INDEX `StudentToEngagements_campusId_fkey`(`campusId`),
    INDEX `StudentToEngagements_engagementId_fkey`(`engagementId`),
    INDEX `StudentToEngagements_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeePlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NULL,
    `monthlyAmt` DOUBLE NOT NULL DEFAULT 0,
    `yearlyAmt` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `FeePlan_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeePlanBreakup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feePlanId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `isYearly` TINYINT NOT NULL DEFAULT 0,
    `breakupname` VARCHAR(255) NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,

    INDEX `FeePlanBreakup_campusId_fkey`(`campusId`),
    INDEX `FeePlanBreakup_feePlanId_fkey`(`feePlanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentFees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `feePlanId` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `active` TINYINT NOT NULL DEFAULT 1,

    INDEX `StudentFees_campusId_fkey`(`campusId`),
    INDEX `StudentFees_feePlanId_fkey`(`feePlanId`),
    INDEX `StudentFees_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentFeesAudit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentFeesId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `feePlanId` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ongoingSession` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MYAALInvoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `feeType` ENUM('MONTHLY', 'YEARLY', 'ADHOC', 'LATE', 'ARREAR') NOT NULL DEFAULT 'MONTHLY',
    `feeStatus` ENUM('Paid', 'Unpaid', 'Partial', 'Cancelled') NOT NULL DEFAULT 'Unpaid',
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `dueDate` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `invoiceNumber` VARCHAR(255) NOT NULL,
    `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    `paidOn` DATETIME(6) NULL,
    `paymentType` ENUM('Cash', 'Cheque', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash',
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `ongoingSession` INTEGER NULL,

    UNIQUE INDEX `MYAALInvoices_invoiceNumber_key`(`invoiceNumber`),
    INDEX `MYAALInvoices_campusId_fkey`(`campusId`),
    INDEX `MYAALInvoices_classId_fkey`(`classId`),
    INDEX `MYAALInvoices_sectionId_fkey`(`sectionId`),
    INDEX `MYAALInvoices_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FamilyCredit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `availableCredit` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `FamilyCredit_campusId_fkey`(`campusId`),
    INDEX `FamilyCredit_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `transactionType` ENUM('Debit', 'Credit') NOT NULL DEFAULT 'Credit',
    `source` ENUM('StudentFeePayment', 'StaffSalaryPayment', 'FamilyCreditAdded', 'StudentFeePaymentUsingFamilyCredit', 'NewLoanToEmployee', 'LoanPaymentByEmployee', 'SellProductsFromInventory', 'BuyProductsIntoInventory', 'OtherExpenses') NOT NULL DEFAULT 'StudentFeePayment',
    `invoiceNumber` VARCHAR(255) NULL,
    `userId` INTEGER NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `paymentType` ENUM('Cash', 'Cheque', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash',
    `familyCreditId` INTEGER NULL,
    `employeeLoanId` INTEGER NULL,
    `sellDetailsId` INTEGER NULL,
    `expenseId` INTEGER NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,

    INDEX `Transactions_campusId_fkey`(`campusId`),
    INDEX `Transactions_classId_fkey`(`classId`),
    INDEX `Transactions_employeeLoanId_fkey`(`employeeLoanId`),
    INDEX `Transactions_expenseId_fkey`(`expenseId`),
    INDEX `Transactions_familyCreditId_fkey`(`familyCreditId`),
    INDEX `Transactions_sectionId_fkey`(`sectionId`),
    INDEX `Transactions_sellDetailsId_fkey`(`sellDetailsId`),
    INDEX `Transactions_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `approvalStatus` ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'Pending',
    `totalLoan` DOUBLE NOT NULL DEFAULT 0,
    `monthlyAmt` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `reason` VARCHAR(4000) NOT NULL,
    `approvalResponse` VARCHAR(4000) NULL,

    INDEX `LoanRequest_campusId_fkey`(`campusId`),
    INDEX `LoanRequest_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeLoan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loanAccountId` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `totalLoan` DOUBLE NOT NULL DEFAULT 0,
    `monthlyAmt` DOUBLE NOT NULL DEFAULT 0,
    `remainingSum` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `EmployeeLoan_campusId_fkey`(`campusId`),
    INDEX `EmployeeLoan_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoanDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `LoanId` VARCHAR(255) NOT NULL,
    `employeeLoanId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `status` TINYINT NOT NULL DEFAULT 1,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `LoanDetails_campusId_fkey`(`campusId`),
    INDEX `LoanDetails_employeeLoanId_fkey`(`employeeLoanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalaryPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NULL,
    `monthlyInhand` DOUBLE NOT NULL DEFAULT 0,
    `yearlyPackage` DOUBLE NOT NULL DEFAULT 0,
    `professionalTaxMonthly` DOUBLE NOT NULL DEFAULT 0,
    `gratuityMonthly` DOUBLE NOT NULL DEFAULT 0,
    `employeePFMonthly` DOUBLE NOT NULL DEFAULT 0,
    `employerPFMonthly` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `SalaryPlan_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxSlabs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` TINYINT NOT NULL DEFAULT 1,
    `regime` ENUM('Old', 'New') NOT NULL DEFAULT 'Old',
    `slab_order` INTEGER NOT NULL,
    `income_min` INTEGER NOT NULL,
    `income_max` INTEGER NOT NULL,
    `tax_rate` DOUBLE NOT NULL DEFAULT 0,
    `fixed_tax` DOUBLE NOT NULL DEFAULT 0,
    `notes` VARCHAR(255) NULL,
    `financialYearId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxRebate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` TINYINT NOT NULL DEFAULT 1,
    `regime` ENUM('Old', 'New') NOT NULL DEFAULT 'Old',
    `minIncome` DOUBLE NOT NULL DEFAULT 0,
    `maxIncome` DOUBLE NOT NULL DEFAULT 0,
    `rebateAmount` DOUBLE NOT NULL DEFAULT 0,
    `financialYearId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalaryPlanBreakup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salaryPlanId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `breakupname` VARCHAR(255) NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `type` VARCHAR(255) NOT NULL DEFAULT 'MONTHLY',

    INDEX `SalaryPlanBreakup_campusId_fkey`(`campusId`),
    INDEX `SalaryPlanBreakup_salaryPlanId_fkey`(`salaryPlanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeSalary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `salaryPlanId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `EmployeeSalary_campusId_fkey`(`campusId`),
    INDEX `EmployeeSalary_salaryPlanId_fkey`(`salaryPlanId`),
    INDEX `EmployeeSalary_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AllBonusInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `financialYearId` INTEGER NULL,
    `paySlipId` INTEGER NULL,
    `userId` INTEGER NULL,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaySlip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceNumber` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `slipType` ENUM('MONTHLY', 'YEARLY', 'ADHOC', 'LATE', 'ARREAR') NOT NULL DEFAULT 'MONTHLY',
    `slipStatus` ENUM('Paid', 'Unpaid', 'Partial', 'Cancelled') NOT NULL DEFAULT 'Unpaid',
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `amountBeforeDeductables` DOUBLE NOT NULL DEFAULT 0,
    `professionalTaxMonthly` DOUBLE NOT NULL DEFAULT 0,
    `gratuityMonthly` DOUBLE NOT NULL DEFAULT 0,
    `employeePFMonthly` DOUBLE NOT NULL DEFAULT 0,
    `employerPFMonthly` DOUBLE NOT NULL DEFAULT 0,
    `emis` DOUBLE NOT NULL DEFAULT 0,
    `tax` DOUBLE NOT NULL DEFAULT 0,
    `bonus` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `financialYearId` INTEGER NULL,

    UNIQUE INDEX `PaySlip_invoiceNumber_key`(`invoiceNumber`),
    INDEX `PaySlip_campusId_fkey`(`campusId`),
    INDEX `PaySlip_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalaryPaymentRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceNumber` VARCHAR(255) NOT NULL,
    `paySlipId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `paymentType` ENUM('Cash', 'Cheque', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash',
    `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    `paidOn` DATETIME(6) NULL,
    `vendor` VARCHAR(191) NOT NULL,
    `referenceNo` VARCHAR(191) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `SalaryPaymentRecord_invoiceNumber_key`(`invoiceNumber`),
    INDEX `SalaryPaymentRecord_campusId_fkey`(`campusId`),
    INDEX `SalaryPaymentRecord_paySlipId_fkey`(`paySlipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudyMaterial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `subjectId` INTEGER NULL,
    `fileType` ENUM('Word', 'PDF', 'Excel', 'URL', 'Audio', 'Video') NOT NULL DEFAULT 'Video',
    `active` TINYINT NOT NULL DEFAULT 1,
    `title` VARCHAR(255) NULL,
    `description` LONGTEXT NULL,
    `url` VARCHAR(255) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `StudyMaterial_campusId_fkey`(`campusId`),
    INDEX `StudyMaterial_classId_fkey`(`classId`),
    INDEX `StudyMaterial_sectionId_fkey`(`sectionId`),
    INDEX `StudyMaterial_subjectId_fkey`(`subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accessName` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permissionId` INTEGER NULL,
    `accessId` INTEGER NULL,
    `campusId` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NOT NULL,
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NOT NULL,

    INDEX `AccessPermission_accessId_fkey`(`accessId`),
    INDEX `AccessPermission_campusId_fkey`(`campusId`),
    INDEX `AccessPermission_permissionId_fkey`(`permissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Theme` (
    `id` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `themeType` ENUM('System', 'User') NOT NULL DEFAULT 'System',
    `themeName` VARCHAR(255) NOT NULL,
    `scheme` VARCHAR(255) NOT NULL,
    `schemeColor` VARCHAR(255) NULL,
    `fontFamily` VARCHAR(255) NOT NULL,
    `fontSize` INTEGER NULL,
    `primaryColor` VARCHAR(255) NOT NULL,
    `actionGreenButton` VARCHAR(255) NOT NULL,
    `secondaryOrangeButton` VARCHAR(255) NOT NULL,
    `blue` VARCHAR(255) NOT NULL,
    `red` VARCHAR(255) NOT NULL,
    `orange` VARCHAR(255) NOT NULL,
    `yellow` VARCHAR(255) NOT NULL,
    `green` VARCHAR(255) NOT NULL,
    `backg` VARCHAR(255) NOT NULL,
    `foreg` VARCHAR(255) NOT NULL,
    `header` VARCHAR(255) NOT NULL,
    `leftmenu` VARCHAR(255) NOT NULL,
    `white` VARCHAR(255) NULL,
    `black` VARCHAR(255) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `defaultRadius` INTEGER NOT NULL DEFAULT 5,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `categoryName` VARCHAR(255) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `description` VARCHAR(255) NOT NULL,

    INDEX `StockCategory_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `categoryId` INTEGER NOT NULL,
    `appUniqueCode` VARCHAR(255) NOT NULL,
    `productCode` VARCHAR(255) NOT NULL,
    `productName` VARCHAR(255) NOT NULL,
    `purchasePrice` DOUBLE NOT NULL DEFAULT 0,
    `sellPrice` DOUBLE NOT NULL DEFAULT 0,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `StockProduct_campusId_fkey`(`campusId`),
    INDEX `StockProduct_categoryId_fkey`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellProductDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `productId` INTEGER NOT NULL,
    `sellPrice` DOUBLE NOT NULL DEFAULT 0,
    `quantity` INTEGER NOT NULL,
    `totalSellPrice` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `sellDetailsId` INTEGER NULL,

    INDEX `SellProductDetails_campusId_fkey`(`campusId`),
    INDEX `SellProductDetails_productId_fkey`(`productId`),
    INDEX `SellProductDetails_sellDetailsId_fkey`(`sellDetailsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `totalQuantity` INTEGER NOT NULL,
    `combinedSellPrice` DOUBLE NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `soldToId` INTEGER NULL,
    `invoiceNumber` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `SellDetails_invoiceNumber_key`(`invoiceNumber`),
    INDEX `SellDetails_campusId_fkey`(`campusId`),
    INDEX `SellDetails_soldToId_fkey`(`soldToId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leaves` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `userType` ENUM('admin', 'student', 'staff', 'parent', 'accountant') NOT NULL DEFAULT 'student',
    `isApproved` TINYINT NOT NULL DEFAULT 0,
    `reason` VARCHAR(255) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `rejectApproveReason` VARCHAR(255) NULL,
    `ongoingSession` INTEGER NULL,

    INDEX `Leaves_campusId_fkey`(`campusId`),
    INDEX `Leaves_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeaveDates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leaveId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `date` VARCHAR(255) NULL,

    INDEX `LeaveDates_campusId_fkey`(`campusId`),
    INDEX `LeaveDates_leaveId_fkey`(`leaveId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentRatings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `comments` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `classId` INTEGER NULL,
    `previousComments` LONGTEXT NULL,
    `previousRating` DOUBLE NOT NULL DEFAULT 0,
    `ratingFrom` INTEGER NOT NULL,
    `sectionId` INTEGER NULL,
    `ongoingSession` INTEGER NULL,

    INDEX `StudentRatings_campusId_fkey`(`campusId`),
    INDEX `StudentRatings_classId_fkey`(`classId`),
    INDEX `StudentRatings_ratingFrom_fkey`(`ratingFrom`),
    INDEX `StudentRatings_sectionId_fkey`(`sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpenseType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `typeName` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `ExpenseType_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `typeId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `expenseMethod` ENUM('Cash', 'Cheque', 'Online', 'Wallet', 'Credit') NOT NULL DEFAULT 'Cash',
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `Expense_campusId_fkey`(`campusId`),
    INDEX `Expense_typeId_fkey`(`typeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `gradeName` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `Grade_campusId_fkey`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GradeDivisions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `gradeId` INTEGER NOT NULL,
    `gradeName` VARCHAR(255) NOT NULL,
    `from` DOUBLE NOT NULL DEFAULT 0,
    `to` DOUBLE NOT NULL DEFAULT 0,

    INDEX `GradeDivisions_campusId_fkey`(`campusId`),
    INDEX `GradeDivisions_gradeId_fkey`(`gradeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `sessionId` INTEGER NULL,
    `type` ENUM('Exam', 'Test') NOT NULL DEFAULT 'Exam',
    `examName` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `gradeId` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `Exam_campusId_fkey`(`campusId`),
    INDEX `Exam_gradeId_fkey`(`gradeId`),
    INDEX `Exam_sessionId_fkey`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubjectMarksTimeTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `sessionId` INTEGER NULL,
    `examId` INTEGER NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `subjectId` INTEGER NULL,
    `userId` INTEGER NULL,
    `total` DOUBLE NOT NULL DEFAULT 100,
    `failMarks` DOUBLE NOT NULL DEFAULT 30,
    `obtained` DOUBLE NOT NULL DEFAULT 80,
    `examDate` DATE NULL,
    `startTime` VARCHAR(191) NULL,
    `endTime` VARCHAR(191) NULL,
    `gradeDivisionId` INTEGER NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `remarks` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,

    INDEX `SubjectMarksTimeTable_campusId_fkey`(`campusId`),
    INDEX `SubjectMarksTimeTable_classId_fkey`(`classId`),
    INDEX `SubjectMarksTimeTable_examId_fkey`(`examId`),
    INDEX `SubjectMarksTimeTable_gradeDivisionId_fkey`(`gradeDivisionId`),
    INDEX `SubjectMarksTimeTable_sectionId_fkey`(`sectionId`),
    INDEX `SubjectMarksTimeTable_sessionId_fkey`(`sessionId`),
    INDEX `SubjectMarksTimeTable_subjectId_fkey`(`subjectId`),
    INDEX `SubjectMarksTimeTable_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Result` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `sessionId` INTEGER NULL,
    `examId` INTEGER NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `userId` INTEGER NULL,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `failMarks` DOUBLE NOT NULL DEFAULT 0,
    `obtained` DOUBLE NOT NULL DEFAULT 0,
    `declareResult` TINYINT NOT NULL DEFAULT 0,
    `gradeDivisionId` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `overallRemarks` VARCHAR(191) NULL,
    `rank` INTEGER NULL,

    INDEX `Result_campusId_fkey`(`campusId`),
    INDEX `Result_classId_fkey`(`classId`),
    INDEX `Result_examId_fkey`(`examId`),
    INDEX `Result_gradeDivisionId_fkey`(`gradeDivisionId`),
    INDEX `Result_sectionId_fkey`(`sectionId`),
    INDEX `Result_sessionId_fkey`(`sessionId`),
    INDEX `Result_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `reason` VARCHAR(191) NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `approvalStatus` ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') NOT NULL DEFAULT 'Pending',

    INDEX `RequestParentAccount_campusId_fkey`(`campusId`),
    INDEX `RequestParentAccount_studentId_fkey`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SectionToSubject` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SectionToSubject_AB_unique`(`A`, `B`),
    INDEX `_SectionToSubject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserParentChild` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserParentChild_AB_unique`(`A`, `B`),
    INDEX `_UserParentChild_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SubjectToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SubjectToUser_AB_unique`(`A`, `B`),
    INDEX `_SubjectToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSessionHistory` ADD CONSTRAINT `StudentSessionHistory_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Institute` ADD CONSTRAINT `Institute_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Institute` ADD CONSTRAINT `Institute_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Institute` ADD CONSTRAINT `Institute_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Campus` ADD CONSTRAINT `Campus_instituteId_fkey` FOREIGN KEY (`instituteId`) REFERENCES `Institute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DefaultImageSetting` ADD CONSTRAINT `DefaultImageSetting_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentDetails` ADD CONSTRAINT `PaymentDetails_instituteId_fkey` FOREIGN KEY (`instituteId`) REFERENCES `Institute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransportRoutes` ADD CONSTRAINT `TransportRoutes_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachersInSection` ADD CONSTRAINT `TeachersInSection_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachersInSection` ADD CONSTRAINT `TeachersInSection_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeachersInSection` ADD CONSTRAINT `TeachersInSection_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_onlineClassesId_fkey` FOREIGN KEY (`onlineClassesId`) REFERENCES `OnlineClasses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `TransportRoutes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankInformation` ADD CONSTRAINT `BankInformation_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankInformation` ADD CONSTRAINT `BankInformation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentChildRelation` ADD CONSTRAINT `ParentChildRelation_childrenId_fkey` FOREIGN KEY (`childrenId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentChildRelation` ADD CONSTRAINT `ParentChildRelation_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRequestUser` ADD CONSTRAINT `AdmissionRequestUser_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRequestUser` ADD CONSTRAINT `AdmissionRequestUser_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRecord` ADD CONSTRAINT `AdmissionRecord_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `AdmissionRequestUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRecord` ADD CONSTRAINT `AdmissionRecord_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRecord` ADD CONSTRAINT `AdmissionRecord_ongoingSessionId_fkey` FOREIGN KEY (`ongoingSessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRecord` ADD CONSTRAINT `AdmissionRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuCategoryPermissions` ADD CONSTRAINT `MenuCategoryPermissions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuCategoryPermissions` ADD CONSTRAINT `MenuCategoryPermissions_menuCategoryId_fkey` FOREIGN KEY (`menuCategoryId`) REFERENCES `MenuCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuCategoryPermissions` ADD CONSTRAINT `MenuCategoryPermissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItemPermissions` ADD CONSTRAINT `MenuItemPermissions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItemPermissions` ADD CONSTRAINT `MenuItemPermissions_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `MenuItems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItemPermissions` ADD CONSTRAINT `MenuItemPermissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItems` ADD CONSTRAINT `MenuItems_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `MenuCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineClasses` ADD CONSTRAINT `OnlineClasses_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineClasses` ADD CONSTRAINT `OnlineClasses_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineClasses` ADD CONSTRAINT `OnlineClasses_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListOfValues` ADD CONSTRAINT `ListOfValues_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_ongoingSessionId_fkey` FOREIGN KEY (`ongoingSessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holidays` ADD CONSTRAINT `Holidays_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holidays` ADD CONSTRAINT `Holidays_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holidays` ADD CONSTRAINT `Holidays_ongoingSessionId_fkey` FOREIGN KEY (`ongoingSessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holidays` ADD CONSTRAINT `Holidays_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRequestOrInquiries` ADD CONSTRAINT `AdmissionRequestOrInquiries_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRequestOrInquiries` ADD CONSTRAINT `AdmissionRequestOrInquiries_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailTemplate` ADD CONSTRAINT `EmailTemplate_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailHistory` ADD CONSTRAINT `EmailHistory_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailHistory` ADD CONSTRAINT `EmailHistory_emailTemplateId_fkey` FOREIGN KEY (`emailTemplateId`) REFERENCES `EmailTemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SMSTemplate` ADD CONSTRAINT `SMSTemplate_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SMSHistory` ADD CONSTRAINT `SMSHistory_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SMSHistory` ADD CONSTRAINT `SMSHistory_smsTemplateId_fkey` FOREIGN KEY (`smsTemplateId`) REFERENCES `SMSTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoticeBoard` ADD CONSTRAINT `NoticeBoard_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyHomework` ADD CONSTRAINT `DailyHomework_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyHomework` ADD CONSTRAINT `DailyHomework_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyHomework` ADD CONSTRAINT `DailyHomework_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Engagements` ADD CONSTRAINT `Engagements_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Engagements` ADD CONSTRAINT `Engagements_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToEngagements` ADD CONSTRAINT `StudentToEngagements_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToEngagements` ADD CONSTRAINT `StudentToEngagements_engagementId_fkey` FOREIGN KEY (`engagementId`) REFERENCES `Engagements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToEngagements` ADD CONSTRAINT `StudentToEngagements_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentToEngagements` ADD CONSTRAINT `StudentToEngagements_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeePlan` ADD CONSTRAINT `FeePlan_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeePlanBreakup` ADD CONSTRAINT `FeePlanBreakup_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeePlanBreakup` ADD CONSTRAINT `FeePlanBreakup_feePlanId_fkey` FOREIGN KEY (`feePlanId`) REFERENCES `FeePlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_feePlanId_fkey` FOREIGN KEY (`feePlanId`) REFERENCES `FeePlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_studentFeesId_fkey` FOREIGN KEY (`studentFeesId`) REFERENCES `StudentFees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_feePlanId_fkey` FOREIGN KEY (`feePlanId`) REFERENCES `FeePlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFeesAudit` ADD CONSTRAINT `StudentFeesAudit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FamilyCredit` ADD CONSTRAINT `FamilyCredit_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FamilyCredit` ADD CONSTRAINT `FamilyCredit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_employeeLoanId_fkey` FOREIGN KEY (`employeeLoanId`) REFERENCES `EmployeeLoan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_expenseId_fkey` FOREIGN KEY (`expenseId`) REFERENCES `Expense`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_familyCreditId_fkey` FOREIGN KEY (`familyCreditId`) REFERENCES `FamilyCredit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_sellDetailsId_fkey` FOREIGN KEY (`sellDetailsId`) REFERENCES `SellDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanRequest` ADD CONSTRAINT `LoanRequest_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanRequest` ADD CONSTRAINT `LoanRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeLoan` ADD CONSTRAINT `EmployeeLoan_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeLoan` ADD CONSTRAINT `EmployeeLoan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanDetails` ADD CONSTRAINT `LoanDetails_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoanDetails` ADD CONSTRAINT `LoanDetails_employeeLoanId_fkey` FOREIGN KEY (`employeeLoanId`) REFERENCES `EmployeeLoan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalaryPlan` ADD CONSTRAINT `SalaryPlan_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxSlabs` ADD CONSTRAINT `TaxSlabs_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxRebate` ADD CONSTRAINT `TaxRebate_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalaryPlanBreakup` ADD CONSTRAINT `SalaryPlanBreakup_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalaryPlanBreakup` ADD CONSTRAINT `SalaryPlanBreakup_salaryPlanId_fkey` FOREIGN KEY (`salaryPlanId`) REFERENCES `SalaryPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSalary` ADD CONSTRAINT `EmployeeSalary_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSalary` ADD CONSTRAINT `EmployeeSalary_salaryPlanId_fkey` FOREIGN KEY (`salaryPlanId`) REFERENCES `SalaryPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeSalary` ADD CONSTRAINT `EmployeeSalary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AllBonusInfo` ADD CONSTRAINT `AllBonusInfo_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AllBonusInfo` ADD CONSTRAINT `AllBonusInfo_paySlipId_fkey` FOREIGN KEY (`paySlipId`) REFERENCES `PaySlip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AllBonusInfo` ADD CONSTRAINT `AllBonusInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaySlip` ADD CONSTRAINT `PaySlip_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaySlip` ADD CONSTRAINT `PaySlip_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaySlip` ADD CONSTRAINT `PaySlip_financialYearId_fkey` FOREIGN KEY (`financialYearId`) REFERENCES `FinancialYear`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalaryPaymentRecord` ADD CONSTRAINT `SalaryPaymentRecord_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalaryPaymentRecord` ADD CONSTRAINT `SalaryPaymentRecord_paySlipId_fkey` FOREIGN KEY (`paySlipId`) REFERENCES `PaySlip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyMaterial` ADD CONSTRAINT `StudyMaterial_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyMaterial` ADD CONSTRAINT `StudyMaterial_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyMaterial` ADD CONSTRAINT `StudyMaterial_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyMaterial` ADD CONSTRAINT `StudyMaterial_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPermission` ADD CONSTRAINT `AccessPermission_accessId_fkey` FOREIGN KEY (`accessId`) REFERENCES `Access`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPermission` ADD CONSTRAINT `AccessPermission_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessPermission` ADD CONSTRAINT `AccessPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockCategory` ADD CONSTRAINT `StockCategory_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockProduct` ADD CONSTRAINT `StockProduct_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockProduct` ADD CONSTRAINT `StockProduct_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `StockCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellProductDetails` ADD CONSTRAINT `SellProductDetails_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellProductDetails` ADD CONSTRAINT `SellProductDetails_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `StockProduct`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellProductDetails` ADD CONSTRAINT `SellProductDetails_sellDetailsId_fkey` FOREIGN KEY (`sellDetailsId`) REFERENCES `SellDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellDetails` ADD CONSTRAINT `SellDetails_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellDetails` ADD CONSTRAINT `SellDetails_soldToId_fkey` FOREIGN KEY (`soldToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leaves` ADD CONSTRAINT `Leaves_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leaves` ADD CONSTRAINT `Leaves_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leaves` ADD CONSTRAINT `Leaves_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveDates` ADD CONSTRAINT `LeaveDates_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaveDates` ADD CONSTRAINT `LeaveDates_leaveId_fkey` FOREIGN KEY (`leaveId`) REFERENCES `Leaves`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRatings` ADD CONSTRAINT `StudentRatings_ongoingSession_fkey` FOREIGN KEY (`ongoingSession`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRatings` ADD CONSTRAINT `StudentRatings_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRatings` ADD CONSTRAINT `StudentRatings_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRatings` ADD CONSTRAINT `StudentRatings_ratingFrom_fkey` FOREIGN KEY (`ratingFrom`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentRatings` ADD CONSTRAINT `StudentRatings_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpenseType` ADD CONSTRAINT `ExpenseType_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `ExpenseType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GradeDivisions` ADD CONSTRAINT `GradeDivisions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GradeDivisions` ADD CONSTRAINT `GradeDivisions_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMarksTimeTable` ADD CONSTRAINT `SubjectMarksTimeTable_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMarksTimeTable` ADD CONSTRAINT `SubjectMarksTimeTable_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMarksTimeTable` ADD CONSTRAINT `SubjectMarksTimeTable_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMarksTimeTable` ADD CONSTRAINT `SubjectMarksTimeTable_gradeDivisionId_fkey` FOREIGN KEY (`gradeDivisionId`) REFERENCES `GradeDivisions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMarksTimeTable` ADD CONSTRAINT `SubjectMarksTimeTable_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMarksTimeTable` ADD CONSTRAINT `SubjectMarksTimeTable_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMarksTimeTable` ADD CONSTRAINT `SubjectMarksTimeTable_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectMarksTimeTable` ADD CONSTRAINT `SubjectMarksTimeTable_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_gradeDivisionId_fkey` FOREIGN KEY (`gradeDivisionId`) REFERENCES `GradeDivisions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestParentAccount` ADD CONSTRAINT `RequestParentAccount_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestParentAccount` ADD CONSTRAINT `RequestParentAccount_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SectionToSubject` ADD CONSTRAINT `_SectionToSubject_A_fkey` FOREIGN KEY (`A`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SectionToSubject` ADD CONSTRAINT `_SectionToSubject_B_fkey` FOREIGN KEY (`B`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserParentChild` ADD CONSTRAINT `_UserParentChild_A_fkey` FOREIGN KEY (`A`) REFERENCES `AdmissionRequestUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserParentChild` ADD CONSTRAINT `_UserParentChild_B_fkey` FOREIGN KEY (`B`) REFERENCES `AdmissionRequestUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SubjectToUser` ADD CONSTRAINT `_SubjectToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SubjectToUser` ADD CONSTRAINT `_SubjectToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
