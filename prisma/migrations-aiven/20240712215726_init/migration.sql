-- CreateTable
SET sql_require_primary_key=0;
CREATE TABLE `Sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session` VARCHAR(255) NOT NULL,

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
    `sessionStartMonth` VARCHAR(255) NULL,
    `feeDuesDays` INTEGER NULL,
    `allowOnlineClass` INTEGER NOT NULL DEFAULT 0,
    `jitsiAppID` VARCHAR(255) NULL,
    `allowEmail` INTEGER NOT NULL DEFAULT 0,
    `emailApiKey` VARCHAR(255) NULL,
    `emailFromName` VARCHAR(255) NULL,
    `emailFromId` VARCHAR(255) NULL,
    `allowSMS` INTEGER NOT NULL DEFAULT 0,
    `SMSApiKey` VARCHAR(255) NULL,
    `themeColor` VARCHAR(255) NULL,
    `logo` VARCHAR(255) NOT NULL,
    `headerImage` VARCHAR(255) NOT NULL,
    `schoolLeavingCertId` INTEGER NOT NULL DEFAULT 1,
    `characterCertId` INTEGER NOT NULL DEFAULT 4,
    `dobCertId` INTEGER NOT NULL DEFAULT 6,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusName` VARCHAR(255) NOT NULL,
    `campusAddress` VARCHAR(255) NOT NULL,
    `campusPhone` VARCHAR(255) NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `instituteId` INTEGER NOT NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Class` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `className` VARCHAR(255) NOT NULL,
    `numericName` VARCHAR(255) NOT NULL,
    `teacherId` INTEGER NULL,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionName` VARCHAR(255) NOT NULL,
    `classId` INTEGER NOT NULL,
    `teacherId` INTEGER NULL,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

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
    `photo` VARCHAR(255) NULL,
    `thumbnailUrl` VARCHAR(255) NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `resetPasswordFlag` TINYINT NOT NULL DEFAULT 1,
    `resetPasswordCode` VARCHAR(255) NULL,
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
    `parentType` ENUM('NA_PARENTTYPE', 'Father', 'Mother', 'GrandFather', 'GrandMother', 'LegalGuardian') NULL DEFAULT 'NA_PARENTTYPE',
    `profession` VARCHAR(255) NULL,
    `theme` VARCHAR(255) NULL,
    `colorName` VARCHAR(255) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `parentsNames` VARCHAR(255) NULL,
    `onlineClassesId` INTEGER NULL,

    UNIQUE INDEX `User_idCardNumber_key`(`idCardNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParentChildRelation` (
    `parentId` INTEGER NOT NULL,
    `childrenId` INTEGER NOT NULL,

    PRIMARY KEY (`parentId`, `childrenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdmissionRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `campusId` INTEGER NOT NULL,
    `admissionComments` VARCHAR(255) NULL,
    `rollNumber` VARCHAR(255) NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `userId` INTEGER NULL,
    `userType` ENUM('admin', 'student', 'staff', 'parent', 'accountant') NOT NULL DEFAULT 'student',
    `attendanceType` ENUM('Manual', 'Automated') NOT NULL DEFAULT 'Manual',
    `attendanceStatus` ENUM('UnMarked', 'Present', 'Absent', 'Holiday', 'Leave') NOT NULL DEFAULT 'UnMarked',
    `entryStatus` ENUM('UnMarked', 'OnTime', 'Late', 'LeftEarly') NOT NULL DEFAULT 'UnMarked',
    `dayStatus` ENUM('FullDay', 'HalfDay') NOT NULL DEFAULT 'FullDay',
    `attendanceDate` DATE NULL,
    `recordStartTime` VARCHAR(255) NULL,
    `recordEndTime` VARCHAR(255) NULL,
    `notes` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

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
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeTable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NOT NULL,
    `sectionId` INTEGER NOT NULL,
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
    `name` VARCHAR(255) NULL,
    `subject` VARCHAR(255) NULL,
    `body` LONGTEXT NULL,
    `keywords` VARCHAR(500) NULL,
    `isEditable` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `emailTemplateId` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `tos` VARCHAR(255) NULL,
    `subject` VARCHAR(255) NULL,
    `body` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SMSTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NULL,
    `body` VARCHAR(255) NULL,
    `keywords` VARCHAR(500) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SMSHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `smsTemplateId` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `tos` VARCHAR(255) NULL,
    `body` LONGTEXT NULL,
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeePlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `name` VARCHAR(255) NULL,
    `monthlyAmt` INTEGER NOT NULL DEFAULT 0,
    `yearlyAmt` INTEGER NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeePlanBreakup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `feePlanId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `isYearly` TINYINT NOT NULL DEFAULT 0,
    `breakupname` VARCHAR(255) NULL,
    `amount` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentFees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `feePlanId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `active` TINYINT NOT NULL DEFAULT 1,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FamilyCredit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `availableCredit` INTEGER NOT NULL DEFAULT 0,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MYAALInvoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceNumber` VARCHAR(255) NOT NULL,
    `userId` INTEGER NOT NULL,
    `campusId` INTEGER NOT NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `feeType` ENUM('MONTHLY', 'YEARLY', 'ADHOC', 'LATE', 'ARREAR') NOT NULL DEFAULT 'MONTHLY',
    `feeStatus` ENUM('Paid', 'Unpaid', 'Partial', 'Cancelled') NOT NULL DEFAULT 'Unpaid',
    `paymentType` ENUM('Cash', 'Online', 'Credit') NOT NULL DEFAULT 'Cash',
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `dueDate` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `amount` INTEGER NOT NULL DEFAULT 0,
    `paidAmount` INTEGER NOT NULL DEFAULT 0,
    `paidOn` DATETIME(6) NULL,
    `created_by` INTEGER NOT NULL,
    `updated_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `MYAALInvoices_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campusId` INTEGER NOT NULL,
    `transactionType` ENUM('Debit', 'Credit') NOT NULL DEFAULT 'Credit',
    `source` ENUM('StudentFeePayment', 'StaffSalaryPayment') NOT NULL DEFAULT 'StudentFeePayment',
    `invoiceNumber` VARCHAR(255) NOT NULL,
    `userId` INTEGER NULL,
    `classId` INTEGER NULL,
    `sectionId` INTEGER NULL,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `paymentType` ENUM('Cash', 'Online', 'Credit') NOT NULL DEFAULT 'Cash',
    `created_by` INTEGER NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

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
CREATE TABLE `_SubjectToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SubjectToUser_AB_unique`(`A`, `B`),
    INDEX `_SubjectToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Institute` ADD CONSTRAINT `Institute_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE `Section` ADD CONSTRAINT `Section_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `TransportRoutes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_onlineClassesId_fkey` FOREIGN KEY (`onlineClassesId`) REFERENCES `OnlineClasses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentChildRelation` ADD CONSTRAINT `ParentChildRelation_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParentChildRelation` ADD CONSTRAINT `ParentChildRelation_childrenId_fkey` FOREIGN KEY (`childrenId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRecord` ADD CONSTRAINT `AdmissionRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRecord` ADD CONSTRAINT `AdmissionRecord_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPermission` ADD CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuCategoryPermissions` ADD CONSTRAINT `MenuCategoryPermissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuCategoryPermissions` ADD CONSTRAINT `MenuCategoryPermissions_menuCategoryId_fkey` FOREIGN KEY (`menuCategoryId`) REFERENCES `MenuCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuCategoryPermissions` ADD CONSTRAINT `MenuCategoryPermissions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItemPermissions` ADD CONSTRAINT `MenuItemPermissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItemPermissions` ADD CONSTRAINT `MenuItemPermissions_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `MenuItems`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItemPermissions` ADD CONSTRAINT `MenuItemPermissions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuItems` ADD CONSTRAINT `MenuItems_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `MenuCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineClasses` ADD CONSTRAINT `OnlineClasses_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineClasses` ADD CONSTRAINT `OnlineClasses_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineClasses` ADD CONSTRAINT `OnlineClasses_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTable` ADD CONSTRAINT `TimeTable_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holidays` ADD CONSTRAINT `Holidays_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holidays` ADD CONSTRAINT `Holidays_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Holidays` ADD CONSTRAINT `Holidays_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRequestOrInquiries` ADD CONSTRAINT `AdmissionRequestOrInquiries_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdmissionRequestOrInquiries` ADD CONSTRAINT `AdmissionRequestOrInquiries_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailTemplate` ADD CONSTRAINT `EmailTemplate_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailHistory` ADD CONSTRAINT `EmailHistory_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailHistory` ADD CONSTRAINT `EmailHistory_emailTemplateId_fkey` FOREIGN KEY (`emailTemplateId`) REFERENCES `EmailTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SMSTemplate` ADD CONSTRAINT `SMSTemplate_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SMSHistory` ADD CONSTRAINT `SMSHistory_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SMSHistory` ADD CONSTRAINT `SMSHistory_smsTemplateId_fkey` FOREIGN KEY (`smsTemplateId`) REFERENCES `SMSTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NoticeBoard` ADD CONSTRAINT `NoticeBoard_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyHomework` ADD CONSTRAINT `DailyHomework_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyHomework` ADD CONSTRAINT `DailyHomework_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyHomework` ADD CONSTRAINT `DailyHomework_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeePlan` ADD CONSTRAINT `FeePlan_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeePlanBreakup` ADD CONSTRAINT `FeePlanBreakup_feePlanId_fkey` FOREIGN KEY (`feePlanId`) REFERENCES `FeePlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeePlanBreakup` ADD CONSTRAINT `FeePlanBreakup_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_feePlanId_fkey` FOREIGN KEY (`feePlanId`) REFERENCES `FeePlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFees` ADD CONSTRAINT `StudentFees_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FamilyCredit` ADD CONSTRAINT `FamilyCredit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FamilyCredit` ADD CONSTRAINT `FamilyCredit_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MYAALInvoices` ADD CONSTRAINT `MYAALInvoices_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SectionToSubject` ADD CONSTRAINT `_SectionToSubject_A_fkey` FOREIGN KEY (`A`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SectionToSubject` ADD CONSTRAINT `_SectionToSubject_B_fkey` FOREIGN KEY (`B`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SubjectToUser` ADD CONSTRAINT `_SubjectToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SubjectToUser` ADD CONSTRAINT `_SubjectToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
