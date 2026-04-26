export interface CouponCreateInput {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FLAT";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  validFrom: string;
  validTo: string;
  isActive?: boolean;
}

export interface CouponValidateInput {
  shopId: string;
  couponCode: string;
  cartAmount: number;
}
