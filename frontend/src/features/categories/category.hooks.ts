"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { categoryApi } from "@/features/categories/category.api";

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoryApi.list,
  });

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();
  return {
    create: useMutation({
      mutationFn: categoryApi.create,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
    }),
    update: useMutation({
      mutationFn: ({ categoryId, payload }: { categoryId: string; payload: Parameters<typeof categoryApi.update>[1] }) =>
        categoryApi.update(categoryId, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
    }),
    remove: useMutation({
      mutationFn: categoryApi.remove,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
    }),
  };
};
