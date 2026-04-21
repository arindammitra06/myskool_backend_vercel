// payments/getPaymentAdapter.ts

import { MYAALInvoices } from "@prisma/client";
import { prisma } from "../../db-client";
import { CashfreeAdapter } from "../../models/CashfreeAdapter";
import { PhonePeAdapter } from "../../models/PhonePeAdapter";
import { RazorpayAdapter } from "../../models/RazorpayAdapter";
import { StripeAdapter } from "../../models/StripeAdapter";

export function getPaymentAdapter(provider: string, config: any) {
    switch (provider) {
        case "STRIPE":
            return new StripeAdapter(config);
        case "RAZORPAY":
            return new RazorpayAdapter(config);
        case "CASHFREE":
            return new CashfreeAdapter(config);
        case "PHONEPE":
            return new PhonePeAdapter(config);
        default:
            throw new Error("Unsupported payment provider");
    }
}

export async function createPaymentOrder(invoice: MYAALInvoices, gateway: any, amount: number) {

    const adapter = getPaymentAdapter(gateway.provider, gateway);

    const order = await adapter.createOrder({
        amount: amount,
        currency: "INR",
        invoiceNumber: invoice.invoiceNumber,
        callbackUrl: `${process.env.WEB_APP_URL}app/payment/return`,
    });

    const paymentRequest = await prisma.paymentRequest.create({
        data: {
            invoiceId: invoice.id,
            amount: amount,
            provider: gateway.provider,
            externalOrderId: order.orderId,
        },
    });

    return { paymentRequestId: paymentRequest.id, gatewayPayload: order.payload };
}