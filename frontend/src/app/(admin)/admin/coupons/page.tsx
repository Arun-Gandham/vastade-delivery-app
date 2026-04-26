"use client";

import { useForm } from "react-hook-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { couponApi } from "@/features/coupons/coupon.api";
import { couponSchema } from "@/features/coupons/coupon.validation";
import { applyZodErrors } from "@/lib/utils/forms";

export default function AdminCouponsPage() {
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<Record<string, string>>();

  const onSubmit = handleSubmit(async (values) => {
    const result = couponSchema.safeParse({
      ...values,
      value: Number(values.value),
      minOrderAmount: Number(values.minOrderAmount),
      maxDiscount: values.maxDiscount ? Number(values.maxDiscount) : undefined,
      usageLimit: values.usageLimit ? Number(values.usageLimit) : undefined,
      isActive: values.isActive !== "false",
    });
    if (!result.success) {
      applyZodErrors(result.error as never, setError as never);
      return;
    }
    await couponApi.create(result.data);
    reset();
  });

  return (
    <DashboardShell title="Coupons" navItems={[{ href: "/admin/dashboard", label: "Dashboard" }, { href: "/admin/coupons", label: "Coupons" }]}>
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-text-muted)]">
          The current backend supports coupon create, update, delete, and validate, but does not expose a list endpoint. This screen supports real coupon creation only.
        </p>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={onSubmit}>
          <Input label="Code" error={errors.code?.message} {...register("code")} />
          <Input label="Value" error={errors.value?.message} {...register("value")} />
          <Input label="Minimum Order Amount" error={errors.minOrderAmount?.message} {...register("minOrderAmount")} />
          <Input label="Valid From" type="datetime-local" error={errors.validFrom?.message} {...register("validFrom")} />
          <Input label="Valid To" type="datetime-local" error={errors.validTo?.message} {...register("validTo")} />
          <div className="flex items-end">
            <Button className="w-full" loading={isSubmitting} type="submit">
              Create Coupon
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
