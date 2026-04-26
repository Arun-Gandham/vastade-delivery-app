"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Input } from "@/components/ui/input";
import { useCategoriesQuery, useCategoryMutations } from "@/features/categories/category.hooks";
import { categorySchema, type CategoryInput } from "@/features/categories/category.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { getErrorMessage } from "@/lib/utils/errors";

const defaultCategoryValues: CategoryInput = {
  name: "",
  imageUrl: "",
  parentId: null,
  sortOrder: 0,
};

export default function AdminCategoriesPage() {
  const categoriesQuery = useCategoriesQuery();
  const mutations = useCategoryMutations();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryInput>({ defaultValues: defaultCategoryValues });
  const imageUrl = watch("imageUrl") || "";

  const onSubmit = handleSubmit(async (values) => {
    const result = categorySchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }
    try {
      setSubmitError(null);
      await mutations.create.mutateAsync(result.data);
      reset(defaultCategoryValues);
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Failed to create category"));
    }
  });

  return (
    <DashboardShell title="Categories" navItems={[{ href: "/admin/dashboard", label: "Dashboard" }, { href: "/admin/categories", label: "Categories" }]}>
      <div className="space-y-6">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={onSubmit}>
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <input type="hidden" {...register("imageUrl")} />
          <ImageUploadField
            error={errors.imageUrl?.message}
            folder="categories"
            helperText="Uploads the selected category image directly to S3 and stores only the returned object key."
            label="Category Image"
            onChange={(nextValue) => setValue("imageUrl", nextValue, { shouldDirty: true, shouldValidate: true })}
            value={imageUrl}
          />
          <Input label="Sort Order" type="number" error={errors.sortOrder?.message} {...register("sortOrder")} />
          <div className="flex items-end">
            <Button className="w-full" loading={mutations.create.isPending} type="submit">
              Add Category
            </Button>
          </div>
        </form>
        {submitError ? <p className="text-sm text-[var(--color-danger)]">{submitError}</p> : null}
        <DataState
          isLoading={categoriesQuery.isLoading}
          error={getErrorMessage(categoriesQuery.error, "")}
          isEmpty={!categoriesQuery.data?.length}
          emptyTitle="No categories"
          emptyDescription="Create categories to structure the product catalog."
        >
          <DataTable
            columns={["Name", "Sort Order", "Actions"]}
            rows={(categoriesQuery.data || []).map((item) => ({
              Name: item.name,
              "Sort Order": item.sortOrder || 0,
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
