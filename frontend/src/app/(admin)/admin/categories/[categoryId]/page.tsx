"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { DataState } from "@/components/shared/data-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCategoriesQuery } from "@/features/categories/category.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminCategoryDetailPage() {
  const params = useParams<{ categoryId: string }>();
  const categoriesQuery = useCategoriesQuery();
  const category = (categoriesQuery.data || []).find((item) => item.id === params.categoryId);

  return (
    <DataState
      isLoading={categoriesQuery.isLoading}
      error={getErrorMessage(categoriesQuery.error, "")}
      isEmpty={!category}
      emptyTitle="Category not found"
      emptyDescription="The requested category could not be found in the current catalog list."
    >
      <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden rounded-[30px] border border-[#e8edf3] bg-white p-0 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#eef2f6] px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Category detail</p>
              <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#111827]">{category?.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/admin/categories">
                <Button variant="outline" className="h-10 rounded-2xl px-4 text-sm font-semibold">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <Link href={`/admin/categories/${category?.id}/edit`}>
                <Button className="h-10 rounded-2xl px-4 text-sm font-semibold">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 p-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[24px] border border-[#eef2f6] bg-[#f8fafc]">
              {category?.imageUrl ? (
                <img src={category.imageUrl} alt={category.name} className="h-full min-h-[320px] w-full object-cover" />
              ) : (
                <div className="flex min-h-[320px] items-center justify-center text-sm font-medium text-[#98a2b3]">
                  No category image uploaded
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="rounded-[24px] border border-[#eef2f6] bg-[#f8fafc] p-4 shadow-none">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a94a6]">Sort order</p>
                  <p className="mt-2 text-xl font-bold text-[#111827]">{category?.sortOrder || 0}</p>
                </Card>
                <Card className="rounded-[24px] border border-[#eef2f6] bg-[#f8fafc] p-4 shadow-none">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a94a6]">Parent</p>
                  {category?.parentId ? (
                    <p className="mt-2 text-sm font-semibold text-[#111827]">{category.parentId}</p>
                  ) : (
                    <div className="mt-2">
                      <Badge className="bg-[#f3f4f6] text-[#475467]">Root category</Badge>
                    </div>
                  )}
                </Card>
              </div>

              <Card className="rounded-[24px] border border-[#eef2f6] bg-[#f8fafc] p-4 shadow-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a94a6]">Image key</p>
                <p className="mt-2 break-all text-sm text-[#667085]">{category?.imageKey || category?.imageUrl || "No image key stored"}</p>
              </Card>

              <Card className="rounded-[24px] border border-[#eef2f6] bg-[#f8fafc] p-4 shadow-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a94a6]">Publishing note</p>
                <p className="mt-2 text-sm leading-7 text-[#667085]">
                  This record is shown with the same image URL and object-key contract used by the storefront and shared mobile-friendly APIs.
                </p>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </DataState>
  );
}
