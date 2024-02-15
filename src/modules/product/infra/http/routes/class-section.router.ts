import { Router } from "express";
import { classSectionControllerInstance } from '../controllers';

const ClassSectionRouter = Router();
ClassSectionRouter.post("/createStudentClass", classSectionControllerInstance.createStudentClass);
ClassSectionRouter.get("/getAllStudentClass/:campusId", classSectionControllerInstance.getAllStudentClass);
ClassSectionRouter.get("/getStudentClassById/:id/:campusId", classSectionControllerInstance.getStudentClassById);
ClassSectionRouter.put("/updateStudentClass/:id/:campusId", classSectionControllerInstance.updateStudentClass);
ClassSectionRouter.delete("/deleteStudentClass/:id/:campusId", classSectionControllerInstance.deleteStudentClass);


ClassSectionRouter.post("/createStudentSection", classSectionControllerInstance.createStudentSection);
ClassSectionRouter.get("/getAllStudentSections/:campusId", classSectionControllerInstance.getAllStudentSections);
ClassSectionRouter.get("/getStudentSectionById/:id/:campusId", classSectionControllerInstance.getStudentSectionById);
ClassSectionRouter.get("/getAllSectionsByClass/:campusId/:classId", classSectionControllerInstance.getAllSectionsByClass);
ClassSectionRouter.put("/updateStudentSection/:id/:campusId", classSectionControllerInstance.updateStudentSection);
ClassSectionRouter.delete("/deleteStudentSection/:id/:campusId", classSectionControllerInstance.deleteStudentSection);

export default ClassSectionRouter;