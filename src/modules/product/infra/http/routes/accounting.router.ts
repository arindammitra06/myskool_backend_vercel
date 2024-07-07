import { Router } from "express";
import { accountingControllerInstance } from "../controllers";

const AccountingRouter = Router();
//AccountingRouter.get("/getStudentFeePaymentStatusForInvoiceGenerate", accountingControllerInstance.getStudentFeePaymentStatusForInvoiceGenerate);
AccountingRouter.post("/getStudentFeePaymentStatusForInvoiceGenerate", accountingControllerInstance.getStudentFeePaymentStatusForInvoiceGenerate);
AccountingRouter.post("/getStudentFeePaymentStatus", accountingControllerInstance.getStudentFeePaymentStatus);
AccountingRouter.post("/generateStudentFeesApiCall", accountingControllerInstance.generateStudentFeesApiCall);
AccountingRouter.post("/updateStudentFeePlan", accountingControllerInstance.updateStudentFeePlan);
AccountingRouter.get("/getAllInvoicesForStudent/:campusId/:userId", accountingControllerInstance.getAllInvoicesForStudent);
AccountingRouter.get("/markAsQuickPaid/:campusId/:id/:currentUserId", accountingControllerInstance.markAsQuickPaid);
AccountingRouter.post("/acceptPayment", accountingControllerInstance.acceptPayment);
export default AccountingRouter;