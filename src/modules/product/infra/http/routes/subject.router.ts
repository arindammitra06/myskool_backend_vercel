import { Router } from "express";
import { subjectControllerInstance } from '../controllers';

const SubjectRouter = Router();
SubjectRouter.post("/createOrUpdateSubject", subjectControllerInstance.createOrUpdateSubject);
SubjectRouter.get("/getAllSubjects/:campusId", subjectControllerInstance.getAllSubjects);
SubjectRouter.get("/getAllSubjectsModel/:campusId", subjectControllerInstance.getAllSubjectsModel);
SubjectRouter.get("/getAllSubjectsModelByClassSection/:campusId/:classId/:sectionId", subjectControllerInstance.getAllSubjectsModelByClassSection);
SubjectRouter.get("/getAllSubjectsByType/:campusId/:type", subjectControllerInstance.getAllSubjectsByType);
SubjectRouter.get("/getSubjectById/:id/:campusId", subjectControllerInstance.getSubjectById);
SubjectRouter.delete("/deleteSubject/:id/:campusId/:userId", subjectControllerInstance.deleteSubject);
SubjectRouter.post("/bulkLoadSubjects", subjectControllerInstance.bulkLoadSubjects);
export default SubjectRouter;