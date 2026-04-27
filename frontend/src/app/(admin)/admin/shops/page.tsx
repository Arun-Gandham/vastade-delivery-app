"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ShopCard } from "@/components/customer/shop-card";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNearbyShopsQuery } from "@/features/shops/shop.hooks";
import { shopApi } from "@/features/shops/shop.api";
import { shopSchema, type ShopInput } from "@/features/shops/shop.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminShopsPage() {
  const shopsQuery = useNearbyShopsQuery();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<ShopInput>();

  const onSubmit = handleSubmit(async (values) => {
    const result = shopSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }
    try {
      setSubmitError(null);
      await shopApi.create(result.data);
      reset();
      await shopsQuery.refetch();
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Failed to create shop"));
    }
  });

  return (
    <div className="space-y-6">
      <form className="grid gap-4 md:grid-cols-3" onSubmit={onSubmit}>
        <Input label="Owner ID" error={errors.ownerId?.message} {...register("ownerId")} />
        <Input label="Shop Name" error={errors.name?.message} {...register("name")} />
        <Input label="Mobile" error={errors.mobile?.message} {...register("mobile")} />
        <Input label="Email" error={errors.email?.message} {...register("email")} />
        <Input label="Address" error={errors.address?.message} {...register("address")} />
        <Input label="Village" error={errors.village?.message} {...register("village")} />
        <Input label="Pincode" error={errors.pincode?.message} {...register("pincode")} />
        <Input label="Opening Time" type="time" error={errors.openingTime?.message} {...register("openingTime")} />
        <Input label="Closing Time" type="time" error={errors.closingTime?.message} {...register("closingTime")} />
        <div className="flex items-end">
          <Button className="w-full" loading={isSubmitting} type="submit">
            Create Shop
          </Button>
        </div>
      </form>
      {submitError ? <p className="text-sm text-[var(--color-danger)]">{submitError}</p> : null}
      <DataState
        isLoading={shopsQuery.isLoading}
        error={getErrorMessage(shopsQuery.error, "")}
        isEmpty={!shopsQuery.data?.length}
        emptyTitle="No shops found"
        emptyDescription="Created shops will appear here."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {shopsQuery.data?.map((shop) => (
            <div key={shop.id} className="space-y-3">
              <ShopCard shop={shop} />
              <Link href={`/admin/shops/${shop.id}`} className="text-sm font-medium text-[var(--color-primary)]">
                Open details
              </Link>
            </div>
          ))}
        </div>
      </DataState>
    </div>
  );
}
