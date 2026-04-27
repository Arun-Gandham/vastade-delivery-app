"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { useProductMutations, useProductsQuery } from "@/features/products/product.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminProductsPage() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/super-admin") ? "/super-admin" : "/admin";
  const productsQuery = useProductsQuery();
  const mutations = useProductMutations();

  return (
    <div className="space-y-6">
      <DataState
        isLoading={productsQuery.isLoading}
        error={getErrorMessage(productsQuery.error, "")}
        isEmpty={!productsQuery.data?.length}
        emptyTitle="No products"
        emptyDescription="Create products to populate the catalog."
      >
        <DataTable
          title="Products"
          description="List-only management view. Create and edit flows open on dedicated pages."
          columns={[
            { key: "Product", label: "Product", cellClassName: "min-w-[300px]" },
            { key: "Preview", label: "Preview", cellClassName: "min-w-[100px]" },
            { key: "Brand", label: "Brand" },
            { key: "Unit", label: "Unit" },
            { key: "Price", label: "Price" },
            { key: "Actions", label: "Actions", cellClassName: "w-[180px]" },
          ]}
          rows={(productsQuery.data || []).map((item) => ({
            Product: (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#111827]">{item.name}</span>
                <span className="text-xs text-[#8a94a6]">{item.categoryId}</span>
              </div>
            ),
            Preview: item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="h-14 w-14 rounded-2xl border border-[#edf1f5] object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[#d7dde5] bg-[#fafbfd] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#98a2b3]">
                N/A
              </div>
            ),
            Brand: item.brand || "-",
            Unit: item.unit,
            Price: `INR ${item.sellingPrice}`,
            Actions: (
              <div className="flex items-center gap-2">
                <Link href={`${basePath}/products/${item.id}`}>
                  <Button variant="outline" className="h-8 w-8 rounded-xl p-0" type="button">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href={`${basePath}/products/${item.id}/edit`}>
                  <Button variant="ghost" className="h-8 w-8 rounded-xl p-0" type="button">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button variant="danger" className="h-8 w-8 rounded-xl p-0" onClick={() => mutations.remove.mutate(item.id)} type="button">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ),
          }))}
          actions={
            <Link href={`${basePath}/products/new`}>
              <Button className="h-10 rounded-2xl px-4 text-sm font-semibold" type="button">
                <Plus className="h-4 w-4" />
                New product
              </Button>
            </Link>
          }
        />
      </DataState>
    </div>
  );
}
