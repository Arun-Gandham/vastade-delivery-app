"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Pencil } from "lucide-react";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProductQuery } from "@/features/products/product.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const pathname = usePathname();
  const basePath = pathname.startsWith("/super-admin") ? "/super-admin" : "/admin";
  const productQuery = useProductQuery(params.productId);

  return (
    <DataState
      isLoading={productQuery.isLoading}
      error={getErrorMessage(productQuery.error, "")}
      isEmpty={!productQuery.data}
      emptyTitle="Product not found"
      emptyDescription="The requested product could not be loaded."
    >
      {productQuery.data ? (
        <Card className="space-y-5 rounded-[30px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{productQuery.data.name}</h1>
              <p className="text-sm text-[var(--color-text-muted)]">{productQuery.data.brand || "No brand"}</p>
            </div>
            <Link href={`${basePath}/products/${params.productId}/edit`}>
              <Button className="h-10 rounded-2xl px-4 text-sm font-semibold" type="button">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <div className="overflow-hidden rounded-[24px] border border-[#eef2f6] bg-[#f8fafc]">
              {productQuery.data.imageUrl ? (
                <img src={productQuery.data.imageUrl} alt={productQuery.data.name} className="h-[220px] w-full object-cover" />
              ) : (
                <div className="flex h-[220px] items-center justify-center text-sm text-[#98a2b3]">No image</div>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-[24px] border border-[#eef2f6] bg-[#f8fafc] p-4 shadow-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a94a6]">Pricing</p>
                <p className="mt-2 text-sm text-[#667085]">MRP: INR {productQuery.data.mrp}</p>
                <p className="text-sm font-semibold text-[#111827]">Selling: INR {productQuery.data.sellingPrice}</p>
              </Card>
              <Card className="rounded-[24px] border border-[#eef2f6] bg-[#f8fafc] p-4 shadow-none">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a94a6]">Catalog</p>
                <p className="mt-2 text-sm text-[#667085]">Category ID: {productQuery.data.categoryId}</p>
                <p className="text-sm text-[#667085]">Unit: {productQuery.data.unit}</p>
              </Card>
            </div>
          </div>
        </Card>
      ) : null}
    </DataState>
  );
}
