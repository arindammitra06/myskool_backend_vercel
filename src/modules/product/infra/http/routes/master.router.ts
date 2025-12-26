import { Router } from "express";
import { masterControllerInstance } from '../controllers';
import upload from "../middlewares/multer";
import { uploadSingleFile } from "../../../../../middleware/upload";


const MasterRouter = Router();
MasterRouter.get("/getImagekitAuth", masterControllerInstance.getImagekitAuth);
MasterRouter.post("/uploadImageToImageKit", upload.single("file"), masterControllerInstance.uploadImageToImageKit);
MasterRouter.post("/upload/:uid", uploadSingleFile, masterControllerInstance.uploadDocument);


MasterRouter.get("/getAllThemes/:campusId/:userId", masterControllerInstance.getAllThemes);
MasterRouter.post("/saveATheme", masterControllerInstance.saveATheme);

MasterRouter.get("/getAllBadges", masterControllerInstance.getAllBadges);
MasterRouter.post("/addUpdateBadge", masterControllerInstance.addUpdateBadge);
MasterRouter.delete("/deleteBadge/:id/:userId", masterControllerInstance.deleteBadge);


MasterRouter.get("/getAllExtracurricular", masterControllerInstance.getAllExtracurricular);
MasterRouter.post("/addUpdateExtracurricular", masterControllerInstance.addUpdateExtracurricular);
MasterRouter.delete("/deleteExtracurricular/:id/:userId", masterControllerInstance.deleteExtracurricular);

MasterRouter.get("/getAllSessions", masterControllerInstance.getAllSessions);
MasterRouter.get("/getAllSessionsCompleteData", masterControllerInstance.getAllSessionsCompleteData);
MasterRouter.post("/addUpdateFinancialYear", masterControllerInstance.addUpdateFinancialYear);
MasterRouter.delete("/deleteFinancialYear/:id/:userId", masterControllerInstance.deleteFinancialYear);

MasterRouter.post("/addUpdateSession", masterControllerInstance.addUpdateSession);
MasterRouter.delete("/deleteSession/:id/:userId", masterControllerInstance.deleteSession);

MasterRouter.get("/getAllFinancialYearsDropdown", masterControllerInstance.getAllFinancialYearsDropdown);
MasterRouter.get("/getAllFinancialYears", masterControllerInstance.getAllFinancialYears);

MasterRouter.post("/addImagesByType", masterControllerInstance.addImagesByType);
MasterRouter.get("/getImagesByType/:campusId/:type", masterControllerInstance.getImagesByType);
MasterRouter.get("/getOnlineMeetings/:campusId", masterControllerInstance.getOnlineMeetings);
MasterRouter.get("/getOnlineMeetingsByClassSection/:campusId/:classId/:sectionId", masterControllerInstance.getOnlineMeetingsByClassSection);
MasterRouter.post("/saveOnlineMeeting", masterControllerInstance.saveOnlineMeeting);
MasterRouter.post("/generateOnlineToken", masterControllerInstance.generateOnlineToken);

MasterRouter.get("/getLOVByUniqueKey/:campusId/:uniqueKey", masterControllerInstance.getLOVByUniqueKey);
MasterRouter.get("/getLOVByGroupName/:campusId/:groupName", masterControllerInstance.getLOVByGroupName);
MasterRouter.post("/createOrUpdateLovs", masterControllerInstance.createOrUpdateLovs);

MasterRouter.get("/getTimeTable/:campusId/:classId/:sectionId/:sessionId", masterControllerInstance.getTimeTable);
MasterRouter.post("/saveTimeTable", masterControllerInstance.saveTimeTable);
MasterRouter.post("/saveAdhocTimeTable", masterControllerInstance.saveAdhocTimeTable);
MasterRouter.post("/saveHoliday", masterControllerInstance.saveHoliday);
MasterRouter.post("/saveWeeklyHoliday", masterControllerInstance.saveWeeklyHoliday);

MasterRouter.get("/deleteTimeTableEvent/:campusId/:id", masterControllerInstance.deleteTimeTableEvent);
MasterRouter.get("/getAllHolidays/:campusId/:classId/:sectionId/:sessionId", masterControllerInstance.getAllHolidays);
MasterRouter.get("/deleteHoliday/:campusId/:id/:currentUserId", masterControllerInstance.deleteHoliday);

MasterRouter.get("/getAllSMSTemplates/:campusId", masterControllerInstance.getAllSMSTemplates);
MasterRouter.post("/saveSmsTemplates", masterControllerInstance.saveSmsTemplates);
MasterRouter.post("/getSmsHistory", masterControllerInstance.getSmsHistory);
MasterRouter.get("/getAllEmailTemplates/:campusId", masterControllerInstance.getAllEmailTemplates);
MasterRouter.post("/saveEmailTemplates", masterControllerInstance.saveEmailTemplates);
MasterRouter.post("/getEmailHistory", masterControllerInstance.getEmailHistory);
MasterRouter.post("/sendAdhocNotification", masterControllerInstance.sendAdhocNotification);

MasterRouter.get("/getNoticesByType/:campusId/:active/:type", masterControllerInstance.getNoticesByType);
MasterRouter.post("/addANotice", masterControllerInstance.addANotice);
MasterRouter.post("/changeNoticeStatus", masterControllerInstance.changeNoticeStatus);


MasterRouter.get("/getActiveCampuses", masterControllerInstance.getActiveCampuses);
MasterRouter.post("/addACampus", masterControllerInstance.addACampus);
MasterRouter.post("/changeCampusStatus", masterControllerInstance.changeCampusStatus);
MasterRouter.post("/changeUserCampus", masterControllerInstance.changeUserCampus);


MasterRouter.get("/getStudyMaterials/:campusId", masterControllerInstance.getStudyMaterials);
MasterRouter.get("/getStudyMaterialsByClassSection/:campusId/:classId/:sectionId", masterControllerInstance.getStudyMaterialsByClassSection);
MasterRouter.post("/addUpdateStudyMaterial", masterControllerInstance.addUpdateStudyMaterial);
MasterRouter.get("/deleteStudyMaterial/:campusId/:id/:currentUserId", masterControllerInstance.deleteStudyMaterial);
MasterRouter.get("/changeStudyMaterialStatus/:campusId/:id/:currentUserId", masterControllerInstance.changeStudyMaterialStatus);

MasterRouter.post("/fetchHomeworks", masterControllerInstance.fetchHomeworks);
MasterRouter.post("/addAHomework", masterControllerInstance.addAHomework);
MasterRouter.post("/fetchEngagements", masterControllerInstance.fetchEngagements);
MasterRouter.post("/fetchStudentEngagements", masterControllerInstance.fetchStudentEngagements);
MasterRouter.post("/addEngagement", masterControllerInstance.addEngagement);
MasterRouter.post("/changeEngagementStatus", masterControllerInstance.changeEngagementStatus);
MasterRouter.post("/saveStudentEngagement", masterControllerInstance.saveStudentEngagement);
MasterRouter.post("/updateEngagementResponse", masterControllerInstance.updateEngagementResponse);
MasterRouter.post("/bulkSaveStudentEngagement", masterControllerInstance.bulkSaveStudentEngagement);
MasterRouter.post("/bulkSaveStudentBadges", masterControllerInstance.bulkSaveStudentBadges);
MasterRouter.post("/bulkSaveStudentBehaviour", masterControllerInstance.bulkSaveStudentBehaviour);
MasterRouter.post("/updateStudentEngagementRatingAndComments", masterControllerInstance.updateStudentEngagementRatingAndComments);
MasterRouter.get("/deleteStudentEngagement/:campusId/:id/:currentUserId", masterControllerInstance.deleteStudentEngagement);

//reset email
MasterRouter.post("/resetPassword", masterControllerInstance.resetPassword);

//Fee Plans
MasterRouter.get("/getActiveFeePlansForDropdown/:campusId", masterControllerInstance.getActiveFeePlansForDropdown);
MasterRouter.get("/getActiveFeePlans/:campusId", masterControllerInstance.getActiveFeePlans);
MasterRouter.get("/getFeePlanBreakup/:campusId", masterControllerInstance.getFeePlanBreakup);
MasterRouter.post("/addUpdateFeePlan", masterControllerInstance.addUpdateFeePlan);
MasterRouter.post("/changeFeePlanStatus", masterControllerInstance.changeFeePlanStatus);

//Leaves
MasterRouter.post("/addUpdateLeaves", masterControllerInstance.addUpdateLeaves);
MasterRouter.get("/getLeavesByUser/:campusId/:userId", masterControllerInstance.getLeavesByUser);
MasterRouter.post("/getAllLeavesForApproval", masterControllerInstance.getAllLeavesForApproval);
MasterRouter.post("/approveRejectRequest", masterControllerInstance.approveRejectRequest);

//Notifications
MasterRouter.get("/getUserNotificationsAndEmails/:campusId/:userId", masterControllerInstance.getUserNotificationsAndEmails);
MasterRouter.get("/getAllNotifications/:campusId", masterControllerInstance.getAllNotifications);
MasterRouter.get("/deleteNotification/:campusId/:id/:currentUserId", masterControllerInstance.deleteNotification);
MasterRouter.post("/updateMasterNotification", masterControllerInstance.updateMasterNotification);
export default MasterRouter;