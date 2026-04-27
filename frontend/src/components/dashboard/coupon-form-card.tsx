"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { couponApi } from "@/features/coupons/coupon.api";
import { couponSchema } from "@/features/coupons/coupon.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { getErrorMessage } from "@/lib/utils/errors";
import type { Coupon } from "@/types/domain";

type CouponFormValues = Record<string, string>;

const defaultCouponValues: CouponFormValues = {
  code: "",
  description: "",
  discountType: "FLAT",
  value: "",
  minOrderAmount: "",
  maxDiscount: "",
  usageLimit: "",
  validFrom: "",
  validTo: "",
  isActive: "true",
};

export const CouponFormCard = ({
  mode,
  coupon,
  onSuccess,
}: {
  mode: "create" | "edit";
  coupon?: Coupon | null;
  onSuccess?: (savedCouponId?: string) => void;
}) => {
  const { register, handleSubmit, setError, reset, setValue, formState: { errors, isSubmitting } } =
    useForm<CouponFormValues>({ defaultValues: defaultCouponValues });

  useEffect(() => {
    if (mode === "edit" && coupon) {
      reset({
        code: coupon.code,
        description: coupon.description || "",
        discountType: coupon.discountType,
        value: String(coupon.value),
        minOrderAmount: String(coupon.minOrderAmount),
        maxDiscount: coupon.maxDiscount === null || coupon.maxDiscount === undefined ? "" : String(coupon.maxDiscount),
        usageLimit: coupon.usageLimit === null || coupon.usageLimit === undefined ? "" : String(coupon.usageLimit),
        validFrom: coupon.validFrom.slice(0, 16),
        validTo: coupon.validTo.slice(0, 16),
        isActive: coupon.isActive ? "true" : "false",
      });
      return;
    }

    reset(defaultCouponValues);
  }, [coupon, mode, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      ...values,
      value: Number(values.value),
      minOrderAmount: Number(values.minOrderAmount),
      maxDiscount: values.maxDiscount ? Number(values.maxDiscount) : undefined,
      usageLimit: values.usageLimit ? Number(values.usageLimit) : undefined,
      isActive: values.isActive !== "false",
    };
    const result = couponSchema.safeParse(payload);
    if (!result.success) {
      applyZodErrors(result.error as never, setError as never);
      return;
    }

    try {
      if (mode === "edit" && coupon) {
        const updated = await couponApi.update(coupon.id, result.data);
        onSuccess?.(updated.id);
        return;
      }

      const created = await couponApi.create(result.data);
      reset(defaultCouponValues);
      onSuccess?.(created.id);
    } catch (error) {
      setError("root", { message: getErrorMessage(error, mode === "edit" ? "Failed to update coupon" : "Failed to create coupon") });
    }
  });

  return (
    <Card className="rounded-[30px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
      <div className="border-b border-[#eef2f6] pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Manage coupon</p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#111827]">
          {mode === "edit" ? "Edit coupon" : "Create coupon"}
        </h2>
      </div>

      <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
        <Input label="Code" error={errors.code?.message} {...register("code")} />
        <Input label="Description" error={errors.description?.message} {...register("description")} />
        <Input label="Discount Type" error={errors.discountType?.message} {...register("discountType")} />
        <Input label="Value" type="number" error={errors.value?.message} {...register("value")} />
        <Input label="Minimum Order Amount" type="number" error={errors.minOrderAmount?.message} {...register("minOrderAmount")} />
        <Input label="Max Discount" type="number" error={errors.maxDiscount?.message} {...register("maxDiscount")} />
        <Input label="Usage Limit" type="number" error={errors.usageLimit?.message} {...register("usageLimit")} />
        <Input label="Valid From" type="datetime-local" error={errors.validFrom?.message} {...register("validFrom")} />
        <Input label="Valid To" type="datetime-local" error={errors.validTo?.message} {...register("validTo")} />
        <Input label="Active" error={errors.isActive?.message} {...register("isActive")} />

        {errors.root?.message ? <p className="md:col-span-2 text-sm text-[var(--color-danger)]">{errors.root.message}</p> : null}

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <Button className="h-11 rounded-2xl px-5 text-sm font-semibold" loading={isSubmitting} type="submit">
            {mode === "edit" ? "Save changes" : "Add coupon"}
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-2xl px-5 text-sm font-semibold"
            type="button"
            onClick={() => {
              reset(defaultCouponValues);
              setValue("discountType", "FLAT");
              setValue("isActive", "true");
            }}
          >
            Reset form
          </Button>
        </div>
      </form>
    </Card>
  );
};
