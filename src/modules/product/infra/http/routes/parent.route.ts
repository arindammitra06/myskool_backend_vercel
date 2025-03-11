import { Router } from "express";
import { parentControllerInstance } from '../controllers';


const ParentRouter = Router();

ParentRouter.post("/updateParent", parentControllerInstance.updateParent);
//ParentRouter.get("/getStaffAccById/:id/:campusId", parentControllerInstance.getStaffAccById);
ParentRouter.get("/getAllParentsByCampus/:campusId", parentControllerInstance.getAllParentsByCampus);
ParentRouter.delete("/deleteParentAccount/:id/:campusId/:userId", parentControllerInstance.deleteParentAccount);
ParentRouter.post("/getAllParentsByStudentPatialName", parentControllerInstance.getAllParentsByStudentPatialName);
ParentRouter.post("/requestParentAccount", parentControllerInstance.requestParentAccount);
ParentRouter.get("/fetchParentAccountRequests/:campusId", parentControllerInstance.fetchParentAccountRequests);
ParentRouter.post("/approveRejectParentrequest", parentControllerInstance.approveRejectParentrequest);
export default ParentRouter;