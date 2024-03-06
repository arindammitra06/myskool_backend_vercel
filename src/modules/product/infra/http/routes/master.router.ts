import { Router } from "express";
import { masterControllerInstance } from '../controllers';

const MasterRouter = Router();
MasterRouter.get("/getAllSessions", masterControllerInstance.getAllSessions);
MasterRouter.post("/addImagesByType", masterControllerInstance.addImagesByType);
MasterRouter.get("/getImagesByType/:campusId/:type", masterControllerInstance.getImagesByType);
MasterRouter.get("/getOnlineMeetings/:campusId", masterControllerInstance.getOnlineMeetings);
MasterRouter.post("/saveOnlineMeeting", masterControllerInstance.saveOnlineMeeting);
MasterRouter.post("/generateOnlineToken", masterControllerInstance.generateOnlineToken);

MasterRouter.get("/getLOVByUniqueKey/:campusId/:uniqueKey", masterControllerInstance.getLOVByUniqueKey);
MasterRouter.get("/getLOVByGroupName/:campusId/:groupName", masterControllerInstance.getLOVByGroupName);
MasterRouter.post("/createOrUpdateLovs", masterControllerInstance.createOrUpdateLovs);

MasterRouter.get("/getTimeTable/:campusId/:classId/:sectionId", masterControllerInstance.getTimeTable);
MasterRouter.post("/saveTimeTable", masterControllerInstance.saveTimeTable);
export default MasterRouter;