import { Router } from "express";
import { staffAccControllerInstance } from '../controllers';


const StaffAccRouter = Router();

StaffAccRouter.post("/createStaff/:empType", staffAccControllerInstance.createStaff);
StaffAccRouter.get("/getStaffAccById/:id/:campusId", staffAccControllerInstance.getStaffAccById);
StaffAccRouter.get("/getAllStaffAccByCampus/:campusId/:empType", staffAccControllerInstance.getAllStaffAccByCampus);
StaffAccRouter.delete("/deleteStaffAcccountant/:id/:campusId/:userId", staffAccControllerInstance.deleteStaffAcccountant);
StaffAccRouter.post("/updateStaff/:campusId/:id", staffAccControllerInstance.updateStaff);
StaffAccRouter.post("/getEmployeeLoanStatus", staffAccControllerInstance.getEmployeeLoanStatus);
StaffAccRouter.get("/getAllEmployeesForDropdown/:campusId/:active", staffAccControllerInstance.getAllEmployeesForDropdown);


export default StaffAccRouter;