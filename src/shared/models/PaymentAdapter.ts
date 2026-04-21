export interface PaymentAdapter {
    createOrder(params: {
        amount: number;
        currency: string;
        invoiceNumber: string;
    }): Promise<{
        orderId: string;
        payload: any;
    }>;

    verifyPayment(payload: any): Promise<{
        success: boolean;
        paymentId?: string;
        raw: any;
    }>;

    refund(params: {
        paymentId: string;
        amount: number;
    }): Promise<any>;
}
