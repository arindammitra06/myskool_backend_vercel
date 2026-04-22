import { Router } from "express";
import { InvoicingController } from "../controllers/general/invoicing.controller.js";

const InvoicingRouter = Router();
const controller = new InvoicingController();

InvoicingRouter.delete("/delete-template/:campusId/:id/:userId", controller.deleteTemplate);
InvoicingRouter.post("/generate-and-save/:templateId", controller.generateAndSavePdf);
InvoicingRouter.get("/view/:id", controller.viewSavedPdf);
InvoicingRouter.post("/generate-view/:templateId", controller.generateSaveAndView);
InvoicingRouter.post("/add-template", controller.addPdfTemplate);
InvoicingRouter.get("/get-templates", controller.getTemplates);
InvoicingRouter.get("/get-pdf-me-templates", controller.getPDFMeTemplates);
InvoicingRouter.get("/get-pdf-templates", controller.getPDFTemplates);
InvoicingRouter.post("/update-template", controller.saveOrUpdateTemplate);

export default InvoicingRouter;