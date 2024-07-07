-- AlterTable
ALTER TABLE `Attendance` MODIFY `attendanceStatus` ENUM('UnMarked', 'Present', 'Absent', 'Holiday', 'Leave') NOT NULL DEFAULT 'UnMarked';
