import { Router } from "express";
import { examControllerInstance } from "../controllers";

const ExamRouter = Router();

ExamRouter.get("/getAllGrades/:campusId", examControllerInstance.getAllGrades);
ExamRouter.get("/getAllGradesLookup/:campusId", examControllerInstance.getAllGradesLookup);
ExamRouter.get("/getDivisions/:campusId", examControllerInstance.getDivisions);
ExamRouter.post("/addUpdateGradeDivisions", examControllerInstance.addUpdateGradeDivisions);
ExamRouter.delete("/deleteGrade/:campusId/:id/:userId", examControllerInstance.deleteGrade);
ExamRouter.post("/addEditExam", examControllerInstance.addEditExam);
ExamRouter.get("/getAllExams/:campusId/:sessionId/:examType", examControllerInstance.getAllExams);
ExamRouter.delete("/deleteExam/:campusId/:id/:userId", examControllerInstance.deleteExam);
ExamRouter.get("/getAllExamsLookup/:campusId/:sessionId", examControllerInstance.getAllExamsLookup);

ExamRouter.get("/getAllExamsTimetable/:campusId/:sessionId/:examId/:classId/:sectionId", examControllerInstance.getAllExamsTimetable);
ExamRouter.get("/getAllExamsToEntryMarks/:campusId/:sessionId/:examId/:classId/:sectionId/:subjectId", examControllerInstance.getAllExamsToEntryMarks);
ExamRouter.post("/addUpdateExamTimetable", examControllerInstance.addUpdateExamTimetable);
ExamRouter.post("/saveExamMarks", examControllerInstance.saveExamMarks);
ExamRouter.get("/getExamById/:campusId/:sessionId/:id", examControllerInstance.getExamById);
ExamRouter.delete("/deleteExamTimetable/:campusId/:id/:userId", examControllerInstance.deleteExamTimetable);
ExamRouter.get("/getExamTabulationSheet/:campusId/:sessionId/:classId/:sectionId/:examId", examControllerInstance.getExamTabulationSheet);

ExamRouter.get("/generateResult/:campusId/:sessionId/:examId/:classId/:sectionId/:userId", examControllerInstance.generateResult);
ExamRouter.get("/declareResult/:campusId/:sessionId/:examId/:classId/:sectionId/:userId", examControllerInstance.declareResult);
ExamRouter.get("/getResultsForMarksheetGeneration/:campusId/:sessionId/:examId/:classId/:sectionId/:userId", examControllerInstance.getResultsForMarksheetGeneration);
ExamRouter.get("/getMyAllExams/:campusId/:sessionId/:userId/:classId/:sectionId", examControllerInstance.getMyAllExams);
export default ExamRouter;