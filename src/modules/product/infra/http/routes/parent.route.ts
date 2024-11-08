import { Router } from "express";
import { parentControllerInstance } from '../controllers';


const ParentRouter = Router();

ParentRouter.post("/updateParent", parentControllerInstance.updateParent);
//ParentRouter.get("/getStaffAccById/:id/:campusId", parentControllerInstance.getStaffAccById);
ParentRouter.get("/getAllParentsByCampus/:campusId", parentControllerInstance.getAllParentsByCampus);
ParentRouter.delete("/deleteParentAccount/:id/:campusId/:userId", parentControllerInstance.deleteParentAccount);
ParentRouter.post("/getAllParentsByStudentPatialName", parentControllerInstance.getAllParentsByStudentPatialName);


export default ParentRouter;