import { Router } from "express";
import { accountingControllerInstance } from "../controllers";

const AccountingRouter = Router();

AccountingRouter.get("/getPrimaryParentsDropdown/:campusId", accountingControllerInstance.getPrimaryParentsDropdown);
AccountingRouter.post("/getStudentFeePaymentStatusForInvoiceGenerate", accountingControllerInstance.getStudentFeePaymentStatusForInvoiceGenerate);
AccountingRouter.post("/getStudentFeePaymentStatus", accountingControllerInstance.getStudentFeePaymentStatus);
AccountingRouter.post("/getStudentCreditStatus", accountingControllerInstance.getStudentCreditStatus);
AccountingRouter.post("/generateStudentFeesApiCall", accountingControllerInstance.generateStudentFeesApiCall);
AccountingRouter.post("/updateStudentFeePlan", accountingControllerInstance.updateStudentFeePlan);
AccountingRouter.get("/getAllInvoicesForStudent/:campusId/:userId", accountingControllerInstance.getAllInvoicesForStudent);
AccountingRouter.get("/markAsQuickPaid/:campusId/:id/:currentUserId/:parentID", accountingControllerInstance.markAsQuickPaid);
AccountingRouter.get("/cancelFeeInvoice/:campusId/:id/:currentUserId", accountingControllerInstance.cancelFeeInvoice);
AccountingRouter.post("/acceptPayment", accountingControllerInstance.acceptPayment);
AccountingRouter.post("/acceptFamilyCredit", accountingControllerInstance.acceptFamilyCredit);

AccountingRouter.post("/getFamilyFeesDuesByParentId", accountingControllerInstance.getFamilyFeesDuesByParentId);

AccountingRouter.get("/getActiveCategories", accountingControllerInstance.getActiveCategories);
AccountingRouter.post("/addACategory", accountingControllerInstance.addACategory);
AccountingRouter.post("/changeCategoryStatus", accountingControllerInstance.changeCategoryStatus);
AccountingRouter.get("/getStockOverview/:campusId", accountingControllerInstance.getStockOverview);


AccountingRouter.get("/getAllActiveProducts", accountingControllerInstance.getAllActiveProducts);
AccountingRouter.get("/getAllActiveProductsForSelling", accountingControllerInstance.getAllActiveProductsForSelling);
AccountingRouter.get("/getLatestSellRecords", accountingControllerInstance.getLatestSellRecords);
AccountingRouter.post("/addProduct", accountingControllerInstance.addProduct);
AccountingRouter.delete("/deleteProduct/:campusId/:id/:userId", accountingControllerInstance.deleteProduct);
AccountingRouter.post("/changeProductStatus", accountingControllerInstance.changeProductStatus);
AccountingRouter.post("/recordACashPayment", accountingControllerInstance.recordACashPayment);

export default AccountingRouter;