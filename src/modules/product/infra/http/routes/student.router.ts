import { Router } from "express";
import { studentControllerInstance } from '../controllers';

const StudentRouter = Router();
StudentRouter.post("/createStudent", studentControllerInstance.createStudent);
StudentRouter.post("/bulkLoadStudents", studentControllerInstance.bulkLoadStudents);
StudentRouter.post("/transferStudentCampus", studentControllerInstance.transferStudentCampus);
StudentRouter.post("/promoteStudent", studentControllerInstance.promoteStudent);
StudentRouter.get("/getAllStudents/:campusId", studentControllerInstance.getAllStudents);
StudentRouter.get("/getAllStudentsByClassAndSection/:campusId/:classId/:sectionId/:active", studentControllerInstance.getAllStudentsByClassAndSection);
StudentRouter.get("/getStudentById/:id/:campusId", studentControllerInstance.getStudentId);

StudentRouter.delete("/deleteStudent/:id/:campusId", studentControllerInstance.deleteStudent);
StudentRouter.get("/getStudentBirthday/:campusId", studentControllerInstance.getStudentBirthday);
StudentRouter.get("/getAllAdmissionEnquiry/:campusId/:isFromApp", studentControllerInstance.getAllAdmissionEnquiry);
StudentRouter.post("/createAdmissionInquiry", studentControllerInstance.createAdmissionInquiry);
StudentRouter.post("/approveAdmissionInquiry", studentControllerInstance.approveAdmissionInquiry);
StudentRouter.get("/deleteAdmissionEnquiry/:campusId/:id/:currentUserid", studentControllerInstance.deleteAdmissionEnquiry);
StudentRouter.get("/fetchAdmissionFormStats/:campusId", studentControllerInstance.fetchAdmissionFormStats);
StudentRouter.post("/updateStudent/:campusId/:id", studentControllerInstance.updateStudent);
StudentRouter.get("/getStudingRatingAndComments/:campusId/:classId/:sectionId/:userId", studentControllerInstance.getStudingRatingAndComments);
StudentRouter.post("/saveStudentRating", studentControllerInstance.saveStudentRating);
StudentRouter.post("/getStudentsByStudentPatialNameOrId", studentControllerInstance.getStudentsByStudentPatialNameOrId);
export default StudentRouter;