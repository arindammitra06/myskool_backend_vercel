import { Router } from "express";
import { studentControllerInstance } from '../controllers';

const StudentRouter = Router();
StudentRouter.post("/createStudent", studentControllerInstance.createStudent);
StudentRouter.get("/getAllStudents/:campusId", studentControllerInstance.getAllStudents);
StudentRouter.get("/getAllStudentsByClassAndSection/:campusId/:classId/:sectionId", studentControllerInstance.getAllStudentsByClassAndSection);
StudentRouter.get("/getStudentById/:id/:campusId", studentControllerInstance.getStudentId);
StudentRouter.put("/updateStudent/:id/:campusId", studentControllerInstance.updateStudent);
StudentRouter.delete("/deleteStudent/:id/:campusId", studentControllerInstance.deleteStudent);



export default StudentRouter;