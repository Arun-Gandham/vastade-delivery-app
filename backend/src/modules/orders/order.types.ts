export interface PlaceOrderInput {
  shopId: string;
  addressId: string;
  paymentMode: "COD" | "UPI_MANUAL" | "RAZORPAY";
  couponCode?: string | null;
  customerNotes?: string;
}
