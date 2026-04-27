"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { shopApi } from "@/features/shops/shop.api";
import { shopSchema, type ShopInput } from "@/features/shops/shop.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { getErrorMessage } from "@/lib/utils/errors";
import type { Shop } from "@/types/domain";

const defaultShopValues: ShopInput = {
  ownerId: "",
  name: "",
  mobile: "",
  email: "",
  address: "",
  village: "",
  pincode: "",
  latitude: undefined,
  longitude: undefined,
  openingTime: "",
  closingTime: "",
};

export const ShopFormCard = ({
  mode,
  shop,
  onSuccess,
}: {
  mode: "create" | "edit";
  shop?: Shop | null;
  onSuccess?: (savedShopId?: string) => void;
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopInput>({ defaultValues: defaultShopValues });

  useEffect(() => {
    if (mode === "edit" && shop) {
      reset({
        ownerId: shop.ownerId || "",
        name: shop.name,
        mobile: shop.mobile,
        email: shop.email || "",
        address: shop.address,
        village: shop.village,
        pincode: shop.pincode,
        latitude: shop.latitude === null || shop.latitude === undefined ? undefined : Number(shop.latitude),
        longitude: shop.longitude === null || shop.longitude === undefined ? undefined : Number(shop.longitude),
        openingTime: shop.openingTime || "",
        closingTime: shop.closingTime || "",
      });
      return;
    }

    reset(defaultShopValues);
  }, [mode, reset, shop]);

  const onSubmit = handleSubmit(async (values) => {
    const result = shopSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }

    try {
      setSubmitError(null);
      if (mode === "edit" && shop) {
        const updated = await shopApi.update(shop.id, result.data);
        onSuccess?.(updated.id);
        return;
      }

      const created = await shopApi.create(result.data);
      reset(defaultShopValues);
      onSuccess?.(created.id);
    } catch (error) {
      setSubmitError(getErrorMessage(error, mode === "edit" ? "Failed to update shop" : "Failed to create shop"));
    }
  });

  return (
    <Card className="rounded-[30px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
      <div className="border-b border-[#eef2f6] pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Manage shop</p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#111827]">
          {mode === "edit" ? "Edit shop" : "Create shop"}
        </h2>
      </div>

      <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
        <Input label="Owner ID" error={errors.ownerId?.message} {...register("ownerId")} />
        <Input label="Shop Name" error={errors.name?.message} {...register("name")} />
        <Input label="Mobile" error={errors.mobile?.message} {...register("mobile")} />
        <Input label="Email" error={errors.email?.message} {...register("email")} />
        <Input label="Address" error={errors.address?.message} {...register("address")} />
        <Input label="Village" error={errors.village?.message} {...register("village")} />
        <Input label="Pincode" error={errors.pincode?.message} {...register("pincode")} />
        <Input label="Latitude" type="number" error={errors.latitude?.message} {...register("latitude")} />
        <Input label="Longitude" type="number" error={errors.longitude?.message} {...register("longitude")} />
        <Input label="Opening Time" type="time" error={errors.openingTime?.message} {...register("openingTime")} />
        <Input label="Closing Time" type="time" error={errors.closingTime?.message} {...register("closingTime")} />

        {submitError ? <p className="md:col-span-2 text-sm text-[var(--color-danger)]">{submitError}</p> : null}

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <Button className="h-11 rounded-2xl px-5 text-sm font-semibold" loading={isSubmitting} type="submit">
            {mode === "edit" ? "Save changes" : "Add shop"}
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-2xl px-5 text-sm font-semibold"
            type="button"
            onClick={() => reset(defaultShopValues)}
          >
            Reset form
          </Button>
        </div>
      </form>
    </Card>
  );
};
