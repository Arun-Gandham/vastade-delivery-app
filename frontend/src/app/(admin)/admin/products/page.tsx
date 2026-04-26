"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Input } from "@/components/ui/input";
import { useCategoriesQuery } from "@/features/categories/category.hooks";
import { useProductMutations, useProductsQuery } from "@/features/products/product.hooks";
import { productSchema, type ProductInput } from "@/features/products/product.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { getErrorMessage } from "@/lib/utils/errors";

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

export default function AdminProductsPage() {
  const productsQuery = useProductsQuery();
  const categoriesQuery = useCategoriesQuery();
  const mutations = useProductMutations();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({ defaultValues: defaultProductValues });
  const imageUrl = watch("imageUrl") || "";

  const onSubmit = handleSubmit(async (values) => {
    const result = productSchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }
    try {
      setSubmitError(null);
      await mutations.create.mutateAsync(result.data);
      reset(defaultProductValues);
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Failed to create product"));
    }
  });

  return (
    <DashboardShell title="Products" navItems={[{ href: "/admin/dashboard", label: "Dashboard" }, { href: "/admin/products", label: "Products" }]}>
      <div className="space-y-6">
        <form className="grid gap-4 md:grid-cols-3" onSubmit={onSubmit}>
          <Input label="Category ID" error={errors.categoryId?.message} helperText={`Available categories: ${(categoriesQuery.data || []).map((item) => item.id).join(", ") || "load categories first"}`} {...register("categoryId")} />
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Input label="Brand" error={errors.brand?.message} {...register("brand")} />
          <Input label="Unit" error={errors.unit?.message} {...register("unit")} />
          <Input label="Unit Value" type="number" error={errors.unitValue?.message} {...register("unitValue")} />
          <Input label="MRP" type="number" error={errors.mrp?.message} {...register("mrp")} />
          <Input label="Selling Price" type="number" error={errors.sellingPrice?.message} {...register("sellingPrice")} />
          <input type="hidden" {...register("imageUrl")} />
          <ImageUploadField
            error={errors.imageUrl?.message}
            folder="products"
            helperText="Uploads the selected product image directly to S3 and stores only the returned object key."
            label="Product Image"
            onChange={(nextValue) => setValue("imageUrl", nextValue, { shouldDirty: true, shouldValidate: true })}
            value={imageUrl}
          />
          <div className="flex items-end">
            <Button className="w-full" loading={mutations.create.isPending} type="submit">
              Create Product
            </Button>
          </div>
        </form>
        {submitError ? <p className="text-sm text-[var(--color-danger)]">{submitError}</p> : null}
        <DataState
          isLoading={productsQuery.isLoading}
          error={getErrorMessage(productsQuery.error, "")}
          isEmpty={!productsQuery.data?.length}
          emptyTitle="No products"
          emptyDescription="Create products to populate the catalog."
        >
          <DataTable
            columns={["Name", "Brand", "Unit", "Price", "Actions"]}
            rows={(productsQuery.data || []).map((item) => ({
              Name: item.name,
              Brand: item.brand || "-",
              Unit: item.unit,
              Price: `INR ${item.sellingPrice}`,
              Actions: (
                <Button variant="danger" onClick={() => mutations.remove.mutate(item.id)}>
                  Remove
                </Button>
              ),
            }))}
          />
        </DataState>
      </div>
    </DashboardShell>
  );
}
