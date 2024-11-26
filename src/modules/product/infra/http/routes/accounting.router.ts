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

AccountingRouter.get("/getActiveCategories/:campusId", accountingControllerInstance.getActiveCategories);
AccountingRouter.post("/addACategory", accountingControllerInstance.addACategory);
AccountingRouter.post("/changeCategoryStatus", accountingControllerInstance.changeCategoryStatus);
AccountingRouter.get("/getStockOverview/:campusId", accountingControllerInstance.getStockOverview);

AccountingRouter.get("/getAllActiveProducts/:campusId", accountingControllerInstance.getAllActiveProducts);
AccountingRouter.get("/getAllActiveProductsForSelling/:campusId", accountingControllerInstance.getAllActiveProductsForSelling);
AccountingRouter.get("/getLatestSellRecords/:campusId", accountingControllerInstance.getLatestSellRecords);

AccountingRouter.post("/addAExpense", accountingControllerInstance.addAExpense);
AccountingRouter.get("/getActiveExpenseTypes/:campusId", accountingControllerInstance.getActiveExpenseTypes);
AccountingRouter.get("/getExpenseTypeModel/:campusId", accountingControllerInstance.getExpenseTypeModel);
AccountingRouter.post("/changeExpenseTypeStatus", accountingControllerInstance.changeExpenseTypeStatus);
AccountingRouter.post("/addAExpenseType", accountingControllerInstance.addAExpenseType);
AccountingRouter.get("/getLatestExpenses/:campusId", accountingControllerInstance.getLatestExpenses);
AccountingRouter.delete("/deleteExpense/:campusId/:id/:userId", accountingControllerInstance.deleteExpense);


AccountingRouter.post("/addProduct", accountingControllerInstance.addProduct);
AccountingRouter.delete("/deleteProduct/:campusId/:id/:userId", accountingControllerInstance.deleteProduct);
AccountingRouter.post("/changeProductStatus", accountingControllerInstance.changeProductStatus);
AccountingRouter.post("/recordACashPayment", accountingControllerInstance.recordACashPayment);

export default AccountingRouter;