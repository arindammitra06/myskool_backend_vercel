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
MasterRouter.post("/saveAdhocTimeTable", masterControllerInstance.saveAdhocTimeTable);
MasterRouter.post("/saveHoliday", masterControllerInstance.saveHoliday);
MasterRouter.get("/deleteTimeTableEvent/:campusId/:id", masterControllerInstance.deleteTimeTableEvent);
MasterRouter.get("/getAllHolidays/:campusId/:classId/:sectionId", masterControllerInstance.getAllHolidays);
MasterRouter.get("/deleteHoliday/:campusId/:id/:currentUserId", masterControllerInstance.deleteHoliday);

MasterRouter.get("/getAllSMSTemplates/:campusId", masterControllerInstance.getAllSMSTemplates);
MasterRouter.post("/saveSmsTemplates", masterControllerInstance.saveSmsTemplates);
MasterRouter.post("/getSmsHistory", masterControllerInstance.getSmsHistory);
MasterRouter.get("/getAllEmailTemplates/:campusId", masterControllerInstance.getAllEmailTemplates);
MasterRouter.post("/saveEmailTemplates", masterControllerInstance.saveEmailTemplates);
MasterRouter.post("/getEmailHistory", masterControllerInstance.getEmailHistory);

MasterRouter.get("/getNoticesByType/:campusId/:active/:type", masterControllerInstance.getNoticesByType);
MasterRouter.post("/addANotice", masterControllerInstance.addANotice);
MasterRouter.post("/changeNoticeStatus", masterControllerInstance.changeNoticeStatus);


MasterRouter.get("/getActiveCampuses", masterControllerInstance.getActiveCampuses);
MasterRouter.post("/addACampus", masterControllerInstance.addACampus);
MasterRouter.post("/changeCampusStatus", masterControllerInstance.changeCampusStatus);

MasterRouter.post("/fetchHomeworks", masterControllerInstance.fetchHomeworks);
MasterRouter.post("/addAHomework", masterControllerInstance.addAHomework);

//reset email
MasterRouter.post("/resetPassword", masterControllerInstance.resetPassword);

//Fee Plans
MasterRouter.get("/getActiveFeePlansForDropdown/:campusId", masterControllerInstance.getActiveFeePlansForDropdown);
MasterRouter.get("/getActiveFeePlans/:campusId", masterControllerInstance.getActiveFeePlans);
MasterRouter.get("/getFeePlanBreakup/:campusId", masterControllerInstance.getFeePlanBreakup);
MasterRouter.post("/addUpdateFeePlan", masterControllerInstance.addUpdateFeePlan);
MasterRouter.post("/changeFeePlanStatus", masterControllerInstance.changeFeePlanStatus);
export default MasterRouter;