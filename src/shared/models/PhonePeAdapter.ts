import axios from "axios";
import { PaymentAdapter } from "./PaymentAdapter";

export class PhonePeAdapter implements PaymentAdapter {
    private config;
    private token: string | null = null;

    constructor(config: any) {
        this.config = config;
    }

    // =========================
    // STEP 1 — GET ACCESS TOKEN
    // =========================
    private async getAccessToken() {
        if (this.token) return this.token;

        const params = new URLSearchParams();
        params.append("client_id", this.config.apiKey);
        params.append("client_secret", this.config.secretKey);
        params.append("grant_type", "client_credentials");
        params.append("client_version", "1");

        const res = await axios.post(
            `${this.config.baseUrl}v1/oauth/token`,
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        ).catch((error) => {
            console.log(error)
            return error
        });

        this.token = res.data.access_token;
        return this.token;
    }



    // =========================
    // STEP 2 — CREATE ORDER
    // =========================
    async createOrder({ amount, currency, invoiceNumber, callbackUrl }) {
        const token = await this.getAccessToken();

        const payload = {
            merchantOrderId: invoiceNumber,
            amount: Math.round(amount * 100),
            paymentFlow: {
                type: "PG_CHECKOUT",
                merchantUrls: {
                    redirectUrl: callbackUrl
                }
            },
            redirectMode: "REDIRECT"
        };


        const base64Payload = Buffer
            .from(JSON.stringify(payload))
            .toString("base64");

        const res = await axios.post(
            `${this.config.baseUrl}checkout/v2/pay`,
            {
                request: base64Payload
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `O-Bearer ${token}`
                }
            }
        ).catch((error) => {
            console.log(error)
            return error
        });

        return {
            orderId: invoiceNumber,
            payload: {
                orderId: res.data.orderId,
                amount: amount,
                currency: currency,
                redirectUrl: res.data.redirectUrl,
            },
        };
    }

    // =========================
    // STEP 3 — VERIFY PAYMENT
    // =========================
    async verifyPayment({ merchantOrderId }) {
        const token = await this.getAccessToken();

        const res = await axios.get(
            `${this.config.baseUrl}checkout/v2/order/${merchantOrderId}/status`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `O-Bearer ${token}`,
                },
            }
        );

        const success =
            res.data.state === "COMPLETED" &&
            res.data.paymentDetails?.[0]?.state === "COMPLETED";

        return {
            success,
            paymentId: res.data.paymentDetails?.[0]?.transactionId,
            raw: res.data,
        };
    }
    async refund({ paymentId, amount }) {
        return {
            status: "PENDING",
            paymentId,
            amount,
        };
    }
}
