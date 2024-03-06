import { Router } from "express";
import { staffAccControllerInstance } from '../controllers';


const StaffAccRouter = Router();

StaffAccRouter.post("/createStaff/:empType", staffAccControllerInstance.createStaff);
StaffAccRouter.get("/getStaffAccById/:id/:campusId", staffAccControllerInstance.getStaffAccById);
StaffAccRouter.get("/getAllStaffAccByCampus/:campusId/:empType", staffAccControllerInstance.getAllStaffAccByCampus);
StaffAccRouter.delete("/deleteStaffAcccountant/:id/:campusId/:userId", staffAccControllerInstance.deleteStaffAcccountant);
StaffAccRouter.put("/updateStudentStaff/:id/:campusId", staffAccControllerInstance.updateStudentStaff);


export default StaffAccRouter;