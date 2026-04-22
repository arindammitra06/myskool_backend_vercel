// payments/adapters/CashfreeAdapter.ts
import axios from "axios";
import { PaymentAdapter } from "./PaymentAdapter.js";

export class CashfreeAdapter implements PaymentAdapter {
    private config;

    constructor(config: any) {
        this.config = config;
    }

    async createOrder({ amount, currency, invoiceNumber, callbackUrl }) {
        const res = await axios.post(
            `${this.config.baseUrl}/pg/orders`,
            {
                order_id: invoiceNumber,
                order_amount: amount,
                order_currency: currency,
                customer_details: {
                    customer_id: invoiceNumber,
                    customer_phone: "9999999999",
                },
                order_meta: {
                    return_url: callbackUrl,
                },
            },
            {
                headers: {
                    "x-client-id": this.config.apiKey,
                    "x-client-secret": this.config.secretKey,
                    "Content-Type": "application/json",
                },
            }
        );

        return {
            orderId: invoiceNumber,
            payload: res.data,
        };
    }

    async verifyPayment(payload: any) {
        return {
            success: payload.order_status === "PAID",
            paymentId: payload.cf_payment_id,
            raw: payload,
        };
    }

    async refund({ paymentId, amount }) {
        return axios.post(
            `${this.config.baseUrl}/pg/orders/${paymentId}/refunds`,
            {
                refund_amount: amount,
            },
            {
                headers: {
                    "x-client-id": this.config.apiKey,
                    "x-client-secret": this.config.secretKey,
                },
            }
        );
    }
}
