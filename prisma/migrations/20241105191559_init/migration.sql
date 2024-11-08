-- AlterTable
ALTER TABLE `User` MODIFY `parentType` ENUM('NA_PARENTTYPE', 'Aunt', 'BrotherInLaw', 'Cousin', 'Daughter', 'DaughterInLaw', 'Father', 'FatherInLaw', 'GrandFather', 'GrandMother', 'Husband', 'LegalGuardian', 'Mother', 'MotherInLaw', 'Nephew', 'Sister', 'SisterInLaw', 'Son', 'SonInLaw', 'Uncle', 'Wife') NULL DEFAULT 'NA_PARENTTYPE';
