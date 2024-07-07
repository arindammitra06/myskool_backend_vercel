import { Campus, UserType, AbsenseStatus, AttendanceType, User,EntryStatus ,DayStatus} from "@prisma/client";

export type Attendance = {
    id: number;
    key: string;
    campusId : number;
    campus : Campus;
    classId: number;
    className: string;
    sectionId: number;
    sectionName: string;
    userId: number;
    user: User;
    userType : UserType
    attendanceStatus: AbsenseStatus;
    entryStatus:EntryStatus;
    dayStatus:DayStatus;
    attendanceType: AttendanceType;
    attendanceDate: Date;
    attendanceDateProcessed: string;
    recordStartTime: string;
    recordEndTime: string;
    notes: string;
    created_by: number;
    created_at: Date;
    created_at_processed?:string;
}

export type AttendanceSheetModel = {
    campus : Campus;
    className: string;
    sectionName: string;
    user: User;
    userType : UserType
    attendance: AttendanceShort[];
}

export type AttendanceShort = {
    attendanceStatus: AbsenseStatus;
    entryStatus:EntryStatus;
    dayStatus:DayStatus;
    day:string;
}