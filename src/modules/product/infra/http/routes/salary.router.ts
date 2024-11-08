import { Router } from "express";
import { salaryControllerInstance } from "../controllers";

const SalaryRouter = Router();

//SalaryRouter.get("/getPrimaryParentsDropdown/:campusId", salaryControllerInstance.getPrimaryParentsDropdown);

//SalaryRouter.post("/updateStudentFeePlan", salaryControllerInstance.updateStudentFeePlan);
SalaryRouter.get("/getActiveSalaryPlansForDropdown/:campusId", salaryControllerInstance.getActiveSalaryPlansForDropdown);
SalaryRouter.get("/getActiveSalaryPlans/:campusId", salaryControllerInstance.getActiveSalaryPlans);
SalaryRouter.get("/getSalaryPlanBreakup/:campusId", salaryControllerInstance.getSalaryPlanBreakup);
SalaryRouter.post("/addUpdateSalaryPlan", salaryControllerInstance.addUpdateSalaryPlan);
SalaryRouter.post("/changeSalaryPlanStatus", salaryControllerInstance.changeSalaryPlanStatus);

SalaryRouter.post("/getEmployeesForSalaryGeneration", salaryControllerInstance.getEmployeesForSalaryGeneration);
SalaryRouter.post("/updateEmployeeSalaryPlan", salaryControllerInstance.updateEmployeeSalaryPlan);
SalaryRouter.post("/generateSalaryPayslipForEmployees", salaryControllerInstance.generateSalaryPayslipForEmployees);
SalaryRouter.get("/getAllPaySlipsForEmployee/:campusId/:userId", salaryControllerInstance.getAllPaySlipsForEmployee);
SalaryRouter.post("/createLoanForEmployee", salaryControllerInstance.createLoanForEmployee);
export default SalaryRouter;