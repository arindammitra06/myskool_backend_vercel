import Stripe from "stripe";
import { PaymentAdapter } from "./PaymentAdapter.js";
import type { Stripe as StripeTypes } from "stripe";


type CreateOrderInput = {
    amount: number;
    currency: string;
    invoiceNumber: string;
    callbackUrl: string;
};

type VerifyPaymentInput = {
    sessionId: string;
};

type RefundInput = {
    paymentId: string;
    amount?: number;
};

export class StripeAdapter implements PaymentAdapter {
    private stripe: InstanceType<typeof Stripe>;

    constructor(config: { secretKey: string }) {
        this.stripe = new Stripe(config.secretKey, {
            // Let Stripe manage version automatically (recommended)
        });
    }

    async createOrder({
        amount,
        currency,
        invoiceNumber,
        callbackUrl,
    }: CreateOrderInput) {
        if (!amount || amount <= 0) {
            throw new Error("Invalid amount");
        }

        const session = await this.stripe.checkout.sessions.create({
            mode: "payment",

            // ✅ Either omit completely (Stripe auto-handles methods)
            // OR explicitly define:
            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: `Invoice ${invoiceNumber}`,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],

            success_url: `${callbackUrl}?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${callbackUrl}?status=failed`,

            metadata: { invoiceNumber },
        });

        return {
            orderId: session.id,
            checkoutUrl: session.url, // 👈 important for frontend redirect
            payload: session,
        };
    }

    async verifyPayment({ sessionId }: VerifyPaymentInput) {
        if (!sessionId) {
            throw new Error("sessionId is required");
        }

        const session = await this.stripe.checkout.sessions.retrieve(
            sessionId,
            {
                expand: ["payment_intent"],
            }
        );

        const paymentIntent =
            typeof session.payment_intent === "string"
                ? null
                : session.payment_intent;

        return {
            success: session.payment_status === "paid",
            paymentId:
                paymentIntent?.id ||
                (typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : null),
            amount: session.amount_total,
            currency: session.currency,
            raw: session,
        };
    }

    async refund({ paymentId, amount }: { paymentId: string; amount?: number }) {
        if (!paymentId) {
            throw new Error("paymentId is required");
        }

        const refund = await this.stripe.refunds.create({
            payment_intent: paymentId,
            ...(amount && amount > 0
                ? { amount: Math.round(amount * 100) }
                : {}),
        });

        return {
            refundId: refund.id,
            status: refund.status,
            raw: refund,
        };
    }
}