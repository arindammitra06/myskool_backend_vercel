import { Router } from "express";
import { subjectControllerInstance } from '../controllers';

const SubjectRouter = Router();
SubjectRouter.post("/createOrUpdateSubject", subjectControllerInstance.createOrUpdateSubject);
SubjectRouter.get("/getAllSubjects/:campusId", subjectControllerInstance.getAllSubjects);
SubjectRouter.get("/getAllSubjectsByType/:campusId/:type", subjectControllerInstance.getAllSubjectsByType);
SubjectRouter.get("/getSubjectById/:id/:campusId", subjectControllerInstance.getSubjectById);
SubjectRouter.delete("/deleteSubject/:id/:campusId/:userId", subjectControllerInstance.deleteSubject);

export default SubjectRouter;