import dayjs from "dayjs";
import { DiscountType } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { ERROR_CODES } from "../../constants/error-codes";
import { AppError } from "../../core/errors/app-error";
import { couponRepository } from "./coupon.repository";
import { CouponCreateInput, CouponValidateInput } from "./coupon.types";

export const couponService = {
  async create(input: CouponCreateInput) {
    return couponRepository.create({
      data: {
        ...input,
        validFrom: new Date(input.validFrom),
        validTo: new Date(input.validTo)
      }
    });
  },
  async update(couponId: string, input: Partial<CouponCreateInput>) {
    const coupon = await couponRepository.findById(couponId);
    if (!coupon) {
      throw new AppError("Coupon invalid", StatusCodes.NOT_FOUND, ERROR_CODES.COUPON_INVALID);
    }
    return couponRepository.update(couponId, {
      ...input,
      ...(input.validFrom ? { validFrom: new Date(input.validFrom) } : {}),
      ...(input.validTo ? { validTo: new Date(input.validTo) } : {})
    });
  },
  async remove(couponId: string) {
    return this.update(couponId, { isActive: false });
  },
  async validate(input: CouponValidateInput) {
    const coupon = await couponRepository.findByCode(input.couponCode);
    if (!coupon || !coupon.isActive) {
      throw new AppError("Coupon invalid", StatusCodes.BAD_REQUEST, ERROR_CODES.COUPON_INVALID);
    }
    const now = dayjs();
    if (now.isBefore(coupon.validFrom) || now.isAfter(coupon.validTo)) {
      throw new AppError("Coupon invalid", StatusCodes.BAD_REQUEST, ERROR_CODES.COUPON_INVALID);
    }
    if (input.cartAmount < Number(coupon.minOrderAmount)) {
      throw new AppError("Coupon invalid", StatusCodes.BAD_REQUEST, ERROR_CODES.COUPON_INVALID);
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError("Coupon invalid", StatusCodes.BAD_REQUEST, ERROR_CODES.COUPON_INVALID);
    }

    const discount =
      coupon.discountType === DiscountType.PERCENTAGE
        ? (input.cartAmount * Number(coupon.value)) / 100
        : Number(coupon.value);

    return {
      couponId: coupon.id,
      code: coupon.code,
      discount: coupon.maxDiscount ? Math.min(discount, Number(coupon.maxDiscount)) : discount
    };
  }
};
