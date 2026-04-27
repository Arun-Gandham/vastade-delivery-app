"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCategoriesQuery } from "@/features/categories/category.hooks";
import { productApi } from "@/features/products/product.api";
import { productSchema, type ProductInput } from "@/features/products/product.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { getErrorMessage } from "@/lib/utils/errors";
import type { Product } from "@/types/domain";

const defaultProductValues: ProductInput = {
  categoryId: "",
  name: "",
  description: "",
  brand: "",
  unit: "",
  unitValue: undefined,
  mrp: 0,
  sellingPrice: 0,
  barcode: "",
  imageUrl: "",
};

export const ProductFormCard = ({
  mode,
  product,
  onSuccess,
}: {
  mode: "create" | "edit";
  product?: Product | null;
  onSuccess?: (savedProductId?: string) => void;
}) => {
  const categoriesQuery = useCategoriesQuery();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({ defaultValues: defaultProductValues });

  const imageUrl = watch("imageUrl") || "";

  useEffect(() => {
    if (mode === "edit" && product) {
      reset({
        categoryId: product.categoryId,
        name: product.name,
        description: product.description || "",
        brand: product.brand || "",
        unit: product.unit,
        unitValue: product.unitValue === null || product.unitValue === undefined ? undefined : Number(product.unitValue),
        mrp: Number(product.mrp),
        sellingPrice: Number(product.sellingPrice),
        barcode: "",
        imageUrl: product.imageKey || product.imageUrl || "",
      });
      return;
    }

    reset(defaultProductValues);
  }, [mode, product, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const result = productSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }

    try {
      setSubmitError(null);
      if (mode === "edit" && product) {
        const updated = await productApi.update(product.id, result.data);
        onSuccess?.(updated.id);
        return;
      }

      const created = await productApi.create(result.data);
      reset(defaultProductValues);
      onSuccess?.(created.id);
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, mode === "edit" ? "Failed to update product" : "Failed to create product")
      );
    }
  });

  return (
    <Card className="rounded-[30px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
      <div className="border-b border-[#eef2f6] pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Manage product</p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#111827]">
          {mode === "edit" ? "Edit product" : "Create product"}
        </h2>
      </div>

      <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Category ID"
            error={errors.categoryId?.message}
            helperText={`Available categories: ${(categoriesQuery.data || []).map((item) => item.id).join(", ") || "load categories first"}`}
            {...register("categoryId")}
          />
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Input label="Brand" error={errors.brand?.message} {...register("brand")} />
          <Input label="Unit" error={errors.unit?.message} {...register("unit")} />
          <Input label="Unit Value" type="number" error={errors.unitValue?.message} {...register("unitValue")} />
          <Input label="MRP" type="number" error={errors.mrp?.message} {...register("mrp")} />
          <Input label="Selling Price" type="number" error={errors.sellingPrice?.message} {...register("sellingPrice")} />
          <Input label="Barcode" error={errors.barcode?.message} {...register("barcode")} />
        </div>

        <input type="hidden" {...register("imageUrl")} />
        <ImageUploadField
          error={errors.imageUrl?.message}
          folder="products"
          helperText="Uploads the selected product image directly to S3 and stores only the returned object key."
          label="Product Image"
          onChange={(nextValue) => setValue("imageUrl", nextValue, { shouldDirty: true, shouldValidate: true })}
          previewUrl={product?.imageUrl || ""}
          value={imageUrl}
        />

        {submitError ? <p className="text-sm text-[var(--color-danger)]">{submitError}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button className="h-11 rounded-2xl px-5 text-sm font-semibold" loading={isSubmitting} type="submit">
            {mode === "edit" ? "Save changes" : "Add product"}
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-2xl px-5 text-sm font-semibold"
            type="button"
            onClick={() => reset(defaultProductValues)}
          >
            Reset form
          </Button>
        </div>
      </form>
    </Card>
  );
};
