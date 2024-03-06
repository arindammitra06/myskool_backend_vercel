-- DropForeignKey
ALTER TABLE `Subject` DROP FOREIGN KEY `Subject_sectionId_fkey`;

-- CreateTable
CREATE TABLE `_SectionToSubject` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SectionToSubject_AB_unique`(`A`, `B`),
    INDEX `_SectionToSubject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_SectionToSubject` ADD CONSTRAINT `_SectionToSubject_A_fkey` FOREIGN KEY (`A`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SectionToSubject` ADD CONSTRAINT `_SectionToSubject_B_fkey` FOREIGN KEY (`B`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
