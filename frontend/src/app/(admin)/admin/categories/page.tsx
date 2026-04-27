"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCategoriesQuery, useCategoryMutations } from "@/features/categories/category.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminCategoriesPage() {
  const categoriesQuery = useCategoriesQuery();
  const mutations = useCategoryMutations();
  const categories = categoriesQuery.data || [];
  const categoriesWithImages = categories.filter((category) => Boolean(category.imageUrl)).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr_1fr]">
        <Card className="rounded-[28px] border border-[#e8edf3] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Catalog overview</p>
          <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#111827]">{categories.length}</p>
          <p className="mt-2 text-sm text-[#667085]">Categories available for storefront grouping and product discovery.</p>
        </Card>
        <Card className="rounded-[28px] border border-[#e8edf3] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Images attached</p>
          <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#111827]">{categoriesWithImages}</p>
          <p className="mt-2 text-sm text-[#667085]">Rows with visual thumbnails for stronger storefront navigation.</p>
        </Card>
        <Card className="rounded-[28px] border border-[#e8edf3] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Management flow</p>
          <p className="mt-3 text-lg font-bold tracking-[-0.03em] text-[#111827]">Separate create, view and edit pages</p>
          <p className="mt-2 text-sm text-[#667085]">The list page stays clean while form flows open on dedicated routes.</p>
        </Card>
      </div>

      <DataState
        isLoading={categoriesQuery.isLoading}
        error={getErrorMessage(categoriesQuery.error, "")}
        isEmpty={!categories.length}
        emptyTitle="No categories"
        emptyDescription="Create categories to structure the product catalog."
      >
        <DataTable
          title="Category list"
          description="Shared enterprise table with thumbnails, compact actions, and fuller-width content."
          columns={[
            { key: "Category", label: "Category", cellClassName: "min-w-[320px]" },
            { key: "Preview", label: "Preview", cellClassName: "min-w-[110px]" },
            { key: "Parent", label: "Parent" },
            { key: "Sort Order", label: "Sort Order" },
            { key: "Actions", label: "Actions", cellClassName: "w-[180px]" },
          ]}
          rows={categories.map((item) => ({
            Category: (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#111827]">{item.name}</span>
                <span className="text-xs text-[#8a94a6]">{item.imageKey || item.imageUrl || "No image key"}</span>
              </div>
            ),
            Preview: item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-14 w-14 rounded-2xl border border-[#edf1f5] object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[#d7dde5] bg-[#fafbfd] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#98a2b3]">
                N/A
              </div>
            ),
            Parent: item.parentId ? (
              <span className="text-sm text-[#667085]">{item.parentId}</span>
            ) : (
              <Badge className="bg-[#f3f4f6] text-[#475467]">Root</Badge>
            ),
            "Sort Order": <span className="text-sm font-semibold text-[#111827]">{item.sortOrder || 0}</span>,
            Actions: (
              <div className="flex items-center gap-2">
                <Link href={`/admin/categories/${item.id}`}>
                  <Button variant="outline" className="h-8 w-8 rounded-xl p-0" type="button">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href={`/admin/categories/${item.id}/edit`}>
                  <Button variant="ghost" className="h-8 w-8 rounded-xl p-0" type="button">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  className="h-8 w-8 rounded-xl p-0"
                  onClick={() => mutations.remove.mutate(item.id)}
                  type="button"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ),
          }))}
          actions={
            <Link href="/admin/categories/new">
              <Button className="h-10 rounded-2xl px-4 text-sm font-semibold" type="button">
                <Plus className="h-4 w-4" />
                New category
              </Button>
            </Link>
          }
        />
      </DataState>
    </div>
  );
}
