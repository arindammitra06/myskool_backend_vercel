import { Router } from "express";
import { PaymentController } from "../controllers/general/payment.controller.js";

const PaymentRouter = Router();
const controller = new PaymentController();

PaymentRouter.get("/get-payment-provider", controller.getPaymentProvider);
PaymentRouter.post("/update-payment-provider", controller.updatePaymentProvider);
PaymentRouter.post("/create-order", controller.createPaymentOrderApi);
PaymentRouter.post("/verify-payment", controller.verifyPayment);
PaymentRouter.post("/refund", controller.refund);
PaymentRouter.post("/create-invoice-for-marketplace-purchase", controller.createInvoiceForMarketplacePurchase);

export default PaymentRouter;