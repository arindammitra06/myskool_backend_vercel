// payments/adapters/RazorpayAdapter.ts
import Razorpay from "razorpay";
import crypto from "crypto";
import { PaymentAdapter } from "./PaymentAdapter";

export class RazorpayAdapter implements PaymentAdapter {
    private razorpay;

    constructor(config: any) {
        this.razorpay = new Razorpay({
            key_id: config.apiKey,
            key_secret: config.secretKey,
        });
    }

    async createOrder({ amount, currency, invoiceNumber }) {
        const order = await this.razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency,
            receipt: invoiceNumber,
        });

        return {
            orderId: order.id,
            payload: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: this.razorpay.key_id,
            },
        };
    }

    async verifyPayment(payload: any) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            payload;

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expected = crypto
            .createHmac("sha256", this.razorpay.key_secret)
            .update(body)
            .digest("hex");

        return {
            success: expected === razorpay_signature,
            paymentId: razorpay_payment_id,
            raw: payload,
        };
    }

    async refund({ paymentId, amount }) {
        return this.razorpay.payments.refund(paymentId, {
            amount: Math.round(amount * 100),
        });
    }
}
