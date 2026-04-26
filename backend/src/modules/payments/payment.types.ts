export interface ManualUpiMarkPaidInput {
  orderId: string;
  transactionReference: string;
}

export interface RazorpayCreateOrderInput {
  orderId: string;
}

export interface RazorpayVerifyInput {
  orderId: string;
  providerOrderId: string;
  providerPaymentId: string;
  providerSignature?: string;
}
