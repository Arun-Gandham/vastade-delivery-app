"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageUploadField } from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCategoryMutations } from "@/features/categories/category.hooks";
import { categorySchema, type CategoryInput } from "@/features/categories/category.validation";
import { applyZodErrors } from "@/lib/utils/forms";
import { getErrorMessage } from "@/lib/utils/errors";
import type { Category } from "@/types/domain";

const defaultCategoryValues: CategoryInput = {
  name: "",
  imageUrl: "",
  parentId: null,
  sortOrder: 0,
};

export const CategoryFormCard = ({
  mode,
  category,
  onSuccess,
}: {
  mode: "create" | "edit";
  category?: Category | null;
  onSuccess?: (savedCategoryId?: string) => void;
}) => {
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

  useEffect(() => {
    if (mode === "edit" && category) {
      reset({
        name: category.name,
        imageUrl: category.imageKey || category.imageUrl || "",
        parentId: category.parentId || null,
        sortOrder: category.sortOrder || 0,
      });
      return;
    }

    reset(defaultCategoryValues);
  }, [category, mode, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const result = categorySchema.safeParse(values);
    if (!result.success) {
      applyZodErrors(result.error, setError);
      return;
    }

    try {
      setSubmitError(null);
      if (mode === "edit" && category) {
        const updated = await mutations.update.mutateAsync({
          categoryId: category.id,
          payload: result.data,
        });
        onSuccess?.(updated.id);
        return;
      }

      const created = await mutations.create.mutateAsync(result.data);
      reset(defaultCategoryValues);
      onSuccess?.(created.id);
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, mode === "edit" ? "Failed to update category" : "Failed to create category")
      );
    }
  });

  return (
    <Card className="rounded-[30px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
      <div className="border-b border-[#eef2f6] pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Manage category</p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#111827]">
          {mode === "edit" ? "Edit category" : "Create category"}
        </h2>
      </div>

      <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
        <div className="grid gap-5 xl:grid-cols-2">
          <Input
            label="Category Name"
            placeholder="Vegetables"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Sort Order"
            type="number"
            placeholder="0"
            error={errors.sortOrder?.message}
            {...register("sortOrder")}
          />
        </div>

        <input type="hidden" {...register("imageUrl")} />
        <ImageUploadField
          error={errors.imageUrl?.message}
          folder="categories"
          helperText="Upload a storefront thumbnail. It will be rendered directly inside the shared enterprise table."
          label="Category Image"
          onChange={(nextValue) => setValue("imageUrl", nextValue, { shouldDirty: true, shouldValidate: true })}
          previewUrl={category?.imageUrl || ""}
          value={imageUrl}
        />

        {submitError ? <p className="text-sm text-[var(--color-danger)]">{submitError}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button
            className="h-11 rounded-2xl px-5 text-sm font-semibold"
            loading={mutations.create.isPending || mutations.update.isPending}
            type="submit"
          >
            {mode === "edit" ? "Save changes" : "Add category"}
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-2xl px-5 text-sm font-semibold"
            type="button"
            onClick={() => reset(defaultCategoryValues)}
          >
            Reset form
          </Button>
        </div>
      </form>
    </Card>
  );
};
