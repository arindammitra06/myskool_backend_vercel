import { Router } from "express";
import { classSectionControllerInstance } from '../controllers';

const ClassSectionRouter = Router();
ClassSectionRouter.post("/createStudentClass", classSectionControllerInstance.createStudentClass);
ClassSectionRouter.post("/createOrUpdateClass", classSectionControllerInstance.createOrUpdateClass);
ClassSectionRouter.get("/getAllStudentClass/:campusId", classSectionControllerInstance.getAllStudentClass);
ClassSectionRouter.get("/getAllDetailedClass/:campusId", classSectionControllerInstance.getAllDetailedClass);
ClassSectionRouter.get("/getStudentClassById/:id/:campusId", classSectionControllerInstance.getStudentClassById);
ClassSectionRouter.put("/updateStudentClass/:id/:campusId", classSectionControllerInstance.updateStudentClass);
ClassSectionRouter.delete("/deleteStudentClass/:id/:campusId", classSectionControllerInstance.deleteStudentClass);


ClassSectionRouter.post("/createStudentSection", classSectionControllerInstance.createStudentSection);
ClassSectionRouter.get("/getAllStudentSections/:campusId", classSectionControllerInstance.getAllStudentSections);
ClassSectionRouter.get("/getStudentSectionById/:id/:campusId", classSectionControllerInstance.getStudentSectionById);
ClassSectionRouter.get("/getAllSectionsByClass/:campusId/:classId/:active", classSectionControllerInstance.getAllSectionsByClass);
ClassSectionRouter.get("/changeSectionSubscriptionStatus/:campusId/:sectionId/:isSubscribed/:currentUserid", classSectionControllerInstance.changeSectionSubscriptionStatus);
ClassSectionRouter.put("/updateStudentSection/:id/:campusId", classSectionControllerInstance.updateStudentSection);
ClassSectionRouter.post("/addSubjectToSection", classSectionControllerInstance.addSubjectToSection);
ClassSectionRouter.delete("/deleteStudentSection/:id/:campusId/:userId", classSectionControllerInstance.deleteStudentSection);

export default ClassSectionRouter;