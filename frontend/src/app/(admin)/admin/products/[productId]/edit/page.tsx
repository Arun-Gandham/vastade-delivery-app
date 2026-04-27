"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductFormCard } from "@/components/dashboard/product-form-card";
import { useProductQuery } from "@/features/products/product.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminProductEditPage() {
  const router = useRouter();
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
      <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <ProductFormCard
          mode="edit"
          product={productQuery.data}
          onSuccess={(savedProductId) => router.push(savedProductId ? `${basePath}/products/${savedProductId}` : `${basePath}/products`)}
        />

        <Card className="rounded-[30px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Current record</p>
              <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#111827]">{productQuery.data?.name}</h2>
            </div>
            <Link href={`${basePath}/products/${params.productId}`}>
              <Button variant="outline" className="h-10 rounded-2xl px-4 text-sm font-semibold">
                <ArrowLeft className="h-4 w-4" />
                View detail
              </Button>
            </Link>
          </div>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[#667085]">
            <p>Editing is separated from the product list so the catalog stays easier to scan.</p>
            <p>Use this page for price, image, category, and merchandising updates without crowding the list screen.</p>
          </div>
        </Card>
      </div>
    </DataState>
  );
}
