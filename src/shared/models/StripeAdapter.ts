// payments/adapters/StripeAdapter.ts
import Stripe from "stripe";
import { PaymentAdapter } from "./PaymentAdapter";

export class StripeAdapter implements PaymentAdapter {
    private stripe: Stripe;

    constructor(config: any) {
        this.stripe = new Stripe(config.secretKey, {
            apiVersion: "2026-01-28.clover",
        });
    }

    async createOrder({ amount, currency, invoiceNumber, callbackUrl }) {
        const session = await this.stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: `Invoice ${invoiceNumber}` },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${callbackUrl}?status=success`,
            cancel_url: `${callbackUrl}?status=failed`,
            metadata: { invoiceNumber },
        });

        return {
            orderId: session.id,
            payload: session,
        };
    }

    async verifyPayment(payload: any) {
        const session = await this.stripe.checkout.sessions.retrieve(
            payload.sessionId
        );

        return {
            success: session.payment_status === "paid",
            paymentId: session.payment_intent as string,
            raw: session,
        };
    }

    async refund({ paymentId, amount }) {
        return this.stripe.refunds.create({
            payment_intent: paymentId,
            amount: Math.round(amount * 100),
        });
    }
}
