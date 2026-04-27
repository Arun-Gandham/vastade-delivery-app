"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CategoryFormCard } from "@/components/dashboard/category-form-card";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCategoriesQuery } from "@/features/categories/category.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminCategoryEditPage() {
  const router = useRouter();
  const params = useParams<{ categoryId: string }>();
  const pathname = usePathname();
  const basePath = pathname.startsWith("/super-admin") ? "/super-admin" : "/admin";
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
        <CategoryFormCard
          mode="edit"
          category={category}
          onSuccess={(savedCategoryId) => router.push(savedCategoryId ? `${basePath}/categories/${savedCategoryId}` : `${basePath}/categories`)}
        />

        <Card className="rounded-[30px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Current record</p>
              <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#111827]">{category?.name}</h2>
            </div>
            <Link href={`${basePath}/categories/${category?.id}`}>
              <Button variant="outline" className="h-10 rounded-2xl px-4 text-sm font-semibold">
                <ArrowLeft className="h-4 w-4" />
                View detail
              </Button>
            </Link>
          </div>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[#667085]">
            <p>Editing is separated from the list page so the table remains clean and fast to scan.</p>
            <p>Use this page for updating name, image and sort order without mixing record management with list browsing.</p>
          </div>
        </Card>
      </div>
    </DataState>
  );
}
