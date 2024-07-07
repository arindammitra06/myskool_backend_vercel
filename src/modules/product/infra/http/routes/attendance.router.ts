import { Router } from "express";
import { attendanceControllerInstance } from '../controllers';

const AttendanceRouter = Router();
AttendanceRouter.post("/fetchAnyMonthAttendance", attendanceControllerInstance.fetchAnyMonthAttendance);
AttendanceRouter.post("/fetchAttendanceForReports", attendanceControllerInstance.fetchAttendanceForReports);
AttendanceRouter.get("/fetchAttendanceFormStats/:campusId/:userType", attendanceControllerInstance.fetchAttendanceFormStats);
AttendanceRouter.post("/fetchAttendance", attendanceControllerInstance.fetchAttendance);
AttendanceRouter.post("/updateAttendance", attendanceControllerInstance.updateAttendance);
export default AttendanceRouter;