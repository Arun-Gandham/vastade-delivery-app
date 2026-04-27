"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Pencil } from "lucide-react";
import { DataState } from "@/components/shared/data-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useShopQuery } from "@/features/shops/shop.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminShopDetailPage() {
  const params = useParams<{ shopId: string }>();
  const pathname = usePathname();
  const basePath = pathname.startsWith("/super-admin") ? "/super-admin" : "/admin";
  const shopQuery = useShopQuery(params.shopId);

  return (
    <DataState
      isLoading={shopQuery.isLoading}
      error={getErrorMessage(shopQuery.error, "")}
      isEmpty={!shopQuery.data}
      emptyTitle="Shop unavailable"
      emptyDescription="This shop could not be loaded."
    >
      {shopQuery.data ? (
        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{shopQuery.data.name}</h1>
              <p className="text-sm text-[var(--color-text-muted)]">{shopQuery.data.address}</p>
            </div>
            <Link href={`${basePath}/shops/${params.shopId}/edit`}>
              <Button className="h-10 rounded-2xl px-4 text-sm font-semibold" type="button">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">Status: {shopQuery.data.isOpen ? "Open" : "Closed"}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#f8fafc] p-4 text-sm text-[#667085]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a94a6]">Contact</p>
              <p className="mt-2">{shopQuery.data.mobile}</p>
              <p>{shopQuery.data.email || "No email"}</p>
            </div>
            <div className="rounded-2xl bg-[#f8fafc] p-4 text-sm text-[#667085]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a94a6]">Operations</p>
              <p className="mt-2">{shopQuery.data.village}, {shopQuery.data.pincode}</p>
              <p>{shopQuery.data.openingTime || "07:00"} - {shopQuery.data.closingTime || "22:00"}</p>
            </div>
          </div>
        </Card>
      ) : null}
    </DataState>
  );
}
