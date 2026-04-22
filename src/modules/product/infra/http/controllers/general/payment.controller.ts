import { FeeStatus, FeeType, PaymentTransactionStatus, PaymentType, TransactionType, TransactionSource } from "@prisma/client";
import { Request, Response } from "express";

import moment from "moment";
import { buildMessage, INVOICE_PAID } from "../../../../../../shared/constants/notification.constants.js";
import { prisma } from "../../../../../../shared/db-client.js";
import { generateInvoiceNumber, addANotification } from "../../../../../../shared/helpers/utils/generic.utils.js";
import { createPaymentOrder, getPaymentAdapter } from "../../../../../../shared/helpers/utils/payment.utils.js";

export class PaymentController {

    public async getPaymentProvider(req: Request, res: Response) {
        const provider = await prisma.paymentGatewayConfig.findFirst();

        return res.json({
            status: true,
            data: {
                provider: provider?.provider,
                apiKey: provider?.apiKey,
                secretKey: provider?.secretKey,
                merchantId: provider?.merchantId,
                baseUrl: provider?.baseUrl
            },
            message: `Fetched successfully.`
        });
    }

    public async updatePaymentProvider(req: Request, res: Response) {
        const providerData: any = req.body;
        console.log(providerData)

        try {
            const provider = await prisma.paymentGatewayConfig.findFirst();


            if (!provider) {
                const newProvider = await prisma.paymentGatewayConfig.create({
                    data: {
                        provider: providerData.fields.paymentProvider,
                        apiKey: providerData.fields.paymentConfig.apiKey,
                        secretKey: providerData.fields.paymentConfig.secretKey,
                        merchantId: providerData.fields.paymentConfig.merchantId,
                        baseUrl: providerData.fields.paymentConfig.baseUrl,
                        isActive: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });

                return res.json({
                    status: true,
                    data: newProvider,
                    message: `Created successfully.`
                });

            } else {
                const updatedProvider = await prisma.paymentGatewayConfig.update({
                    where: {
                        id: provider.id,
                    },
                    data: {
                        provider: providerData.fields.paymentProvider,
                        apiKey: providerData.fields.paymentConfig.apiKey,
                        secretKey: providerData.fields.paymentConfig.secretKey,
                        merchantId: providerData.fields.paymentConfig.merchantId,
                        baseUrl: providerData.fields.paymentConfig.baseUrl,
                        isActive: 1,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
                return res.json({ status: true, data: updatedProvider, message: `Updated successfully.` });
            }


        } catch (error) {
            console.error(error);

            return res.json({ status: false, data: null, message: error.message })
        }
    }

    public async createInvoiceForMarketplacePurchase(req: Request, res: Response) {
        try {
            const { currentUserId, forUser, campusId, amount, cartItems } = req.body.form;
            console.log(req.body)
            const institute = await prisma.institute.findFirst();
            if (!forUser) {
                return res.status(400).json({ status: false, message: "User not found" });
            }

            if (amount <= 0) {
                return res.status(400).json({ status: false, message: "Amount should be greater than 0" });
            }

            let latestInvoiceObj = await prisma.mYAALInvoices.findFirst({
                orderBy: {
                    id: 'desc',
                },
                take: 1,
            });
            let latestInvoiceID = latestInvoiceObj !== null && latestInvoiceObj !== undefined ? latestInvoiceObj.id : 0;
            const invoiceNumber = generateInvoiceNumber(latestInvoiceID);


            let futureMonthDueDate = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');;

            const invoice = await prisma.mYAALInvoices.create({
                data: {
                    userId: forUser,
                    invoiceNumber: invoiceNumber,
                    campusId: Number(campusId),
                    feeStatus: FeeStatus.Unpaid,
                    feeType: FeeType.ADHOC,
                    year: Number(new Date().getFullYear()),
                    month: Number(new Date().getMonth()),
                    dueDate: futureMonthDueDate.toDate(),
                    amount: Number(amount),
                    ongoingSession: Number(institute.sessionId),
                    updated_by: currentUserId,
                    updated_at: new Date(),
                    created_by: currentUserId,
                    created_at: new Date(),
                    description: `Marketplace Purchase on ${new Date(new Date().getFullYear(), new Date().getMonth()).toLocaleString("default", {
                        month: "long"
                    })}, ${new Date().getFullYear()} for ${cartItems.map(p => p.productName).join(", ")}`
                },
            });
            return res.json({
                status: true,
                data: { invoice: invoice.id },
                message: "Invoice created",
            });

        } catch (error: any) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }


    public async createPaymentOrderApi(req: Request, res: Response) {
        try {
            const { invoiceId, amount } = req.body.form;
            console.log(req.body)

            if (!invoiceId) {
                return res.status(400).json({ status: false, message: "invoiceId required" });
            }

            // ALWAYS load from DB
            const invoice = await prisma.mYAALInvoices.findUnique({
                where: { id: invoiceId },
            });

            if (!invoice) {
                return res.status(404).json({ status: false, message: "Invoice not found" });
            }


            if (amount <= 0) {
                return res.status(400).json({ status: false, message: "Amount should be greater than 0" });
            }

            const gateway = await prisma.paymentGatewayConfig.findFirst({
                where: { isActive: 1 },
            });

            if (!gateway) {
                throw new Error("No payment gateway configured");
            }
            const paymentOrder = await createPaymentOrder(invoice, gateway, amount);

            return res.json({
                status: true,
                data: { paymentOrder: paymentOrder, provider: gateway.provider.toString() },
                message: "Payment order created",
            });

        } catch (error: any) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    public async verifyPayment(req: Request, res: Response) {
        try {
            const { paymentRequestId, currentUserId } = req.body.form;
            console.log("paymentRequestId ", paymentRequestId)
            if (!paymentRequestId) {
                return res.status(404).json({ status: false, message: "Payment request not found" });
            }
            const paymentRequest = await prisma.paymentRequest.findUnique({
                where: { id: Number(paymentRequestId) },
                include: {
                    invoice: true
                }
            });
            console.log("paymentRequest ", paymentRequest)
            if (!paymentRequest) {
                return res.status(404).json({ status: false, message: "Payment request not found" });
            }

            const gateway = await prisma.paymentGatewayConfig.findFirst({
                where: { isActive: 1 },
            });
            const adapter = getPaymentAdapter(paymentRequest.provider, gateway);
            const result = await adapter.verifyPayment({ merchantOrderId: paymentRequest.invoice.invoiceNumber });
            console.log("result ", result)


            await prisma.paymentTransaction.create({
                data: {
                    paymentRequestId: Number(paymentRequestId),
                    provider: paymentRequest.provider,
                    externalPaymentId: result.paymentId,
                    status: result.success
                        ? PaymentTransactionStatus.SUCCESS
                        : PaymentTransactionStatus.FAILED,
                    rawResponse: result.raw,
                },
            });


            // only update request status
            if (result.success) {
                //update payment request status
                await prisma.paymentRequest.update({
                    where: { id: Number(paymentRequestId) },
                    data: { status: "SUCCESS" },
                });

                let totalPaid = (Number(result.raw.amount) / 100) + paymentRequest.invoice.paidAmount;
                let totalDueNow = paymentRequest.invoice.amount - totalPaid;

                await prisma.mYAALInvoices.update({
                    where: {
                        id: paymentRequest.invoice.id,
                        campusId: paymentRequest.invoice.campusId
                    },
                    data: {
                        feeStatus: paymentRequest.invoice.amount === totalPaid ? FeeStatus.Paid :
                            paymentRequest.invoice.amount > totalPaid ? FeeStatus.Partial : FeeStatus.Paid,
                        paidOn: new Date(),
                        paymentType: PaymentType.Online,
                        //amount: totalDueNow,
                        paidAmount: totalPaid,
                        updated_by: Number(currentUserId),
                        updated_at: new Date()
                    },
                }).then(async (inv) => {
                    await prisma.transactions.create({
                        data: {
                            invoiceNumber: paymentRequest.invoice.invoiceNumber,
                            campusId: paymentRequest.invoice.campusId,
                            transactionType: TransactionType.Credit,
                            source: TransactionSource.StudentFeePayment,
                            userId: paymentRequest.invoice.userId,
                            amount: Number(result.raw.amount) / 100,
                            paymentType: PaymentType.Online,
                            created_by: Number(currentUserId),
                            created_at: new Date(),
                        },
                    });
                    await prisma.user.findUnique({
                        where: {
                            active: 1,
                            id: Number(currentUserId),
                            campusId: Number(paymentRequest.invoice.campusId)
                        },
                    }).then((res) => {
                        addANotification(Number(paymentRequest.invoice.campusId),
                            Number(currentUserId),
                            Number(currentUserId),
                            buildMessage(INVOICE_PAID,
                                inv.invoiceNumber,
                                moment(new Date()).format('DD-MMM-YYYY HH:mm'),
                                res.displayName,
                                (Number(result.raw.amount) / 100).toString()));
                    });
                });
            }

            return res.json({
                status: result.success,
                message: result.success ? "Payment has been verified, and invoice has been updated"
                    : "Failed to verify payment. Please try again later.",
            });

        } catch (err: any) {
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    public async razorpayWebhook(req: Request, res: Response) {
        const event = req.body;

        if (event.event !== "payment.captured") {
            return res.sendStatus(200);
        }

        const orderId = event.payload.payment.entity.order_id;

        const paymentRequest = await prisma.paymentRequest.findFirst({
            where: { externalOrderId: orderId },
            include: { invoice: true },
        });

        if (!paymentRequest) return res.sendStatus(200);

        await prisma.$transaction(async (tx) => {
            await tx.paymentRequest.update({
                where: { id: paymentRequest.id },
                data: { status: "SUCCESS" },
            });

            const newPaid =
                paymentRequest.invoice.paidAmount + paymentRequest.amount;

            await tx.mYAALInvoices.update({
                where: { id: paymentRequest.invoiceId },
                data: {
                    paidAmount: newPaid,
                    feeStatus:
                        newPaid >= paymentRequest.invoice.amount
                            ? FeeStatus.Paid
                            : FeeStatus.Partial,
                },
            });
        });

        res.sendStatus(200);
    }


    public async refund(req: Request, res: Response) {
        const inputData: any = req.body;
        console.log(req.body);
        try {
            const gateway = await prisma.paymentGatewayConfig.findFirst({
                where: {
                    isActive: 1,
                },
            });

            if (!gateway) {
                throw new Error("No payment gateway configured for campus");
            }

            const config = {
                apiKey: gateway.apiKey,
                secretKey: gateway.secretKey,
                merchantId: gateway.merchantId,
                baseUrl: gateway.baseUrl,
            };

            const txn = await prisma.paymentTransaction.findUnique({ where: { id: inputData.paymentTransactionId } });

            const adapter = getPaymentAdapter(txn.provider, config);

            const refund = await adapter.refund({
                paymentId: txn.externalPaymentId,
                amount: inputData.amount,
            });

            await prisma.refund.create({
                data: {
                    paymentTransactionId: txn.id,
                    amount: inputData.amount,
                    status: "SUCCESS",
                    rawResponse: refund,
                },
            });

            return res.json({
                status: true,
                data: refund,
                message: 'Refund successful',
            });
        } catch (error) {
            console.error(error);
            return res
                .status(400)
                .json({ message: error.message, status: false, data: null });
        }
    }
}