"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Pencil, Plus } from "lucide-react";
import { DataState } from "@/components/shared/data-state";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { useNearbyShopsQuery } from "@/features/shops/shop.hooks";
import { getErrorMessage } from "@/lib/utils/errors";

export default function AdminShopsPage() {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/super-admin") ? "/super-admin" : "/admin";
  const shopsQuery = useNearbyShopsQuery();

  return (
    <div className="space-y-6">
      <DataState
        isLoading={shopsQuery.isLoading}
        error={getErrorMessage(shopsQuery.error, "")}
        isEmpty={!shopsQuery.data?.length}
        emptyTitle="No shops found"
        emptyDescription="Created shops will appear here."
      >
        <DataTable
          title="Shops"
          description="List-only management view. Create and edit flows open on dedicated pages."
          columns={[
            { key: "Name", label: "Shop", cellClassName: "min-w-[280px]" },
            { key: "Location", label: "Location", cellClassName: "min-w-[220px]" },
            { key: "Schedule", label: "Schedule" },
            { key: "Status", label: "Status" },
            { key: "Actions", label: "Actions", cellClassName: "w-[140px]" },
          ]}
          rows={(shopsQuery.data || []).map((shop) => ({
            Name: (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#111827]">{shop.name}</span>
                <span className="text-xs text-[#8a94a6]">{shop.mobile}</span>
              </div>
            ),
            Location: (
              <div className="flex flex-col gap-1 text-sm text-[#667085]">
                <span>{shop.address}</span>
                <span>{shop.village}, {shop.pincode}</span>
              </div>
            ),
            Schedule: <span className="text-sm text-[#667085]">{shop.openingTime || "07:00"} - {shop.closingTime || "22:00"}</span>,
            Status: (
              <span className={shop.isOpen ? "text-sm font-semibold text-[#1f9d55]" : "text-sm font-semibold text-[#b42318]"}>
                {shop.isOpen ? "Open" : "Closed"}
              </span>
            ),
            Actions: (
              <div className="flex items-center gap-2">
                <Link href={`${basePath}/shops/${shop.id}`}>
                  <Button variant="outline" className="h-8 w-8 rounded-xl p-0" type="button">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href={`${basePath}/shops/${shop.id}/edit`}>
                  <Button variant="ghost" className="h-8 w-8 rounded-xl p-0" type="button">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ),
          }))}
          actions={
            <Link href={`${basePath}/shops/new`}>
              <Button className="h-10 rounded-2xl px-4 text-sm font-semibold" type="button">
                <Plus className="h-4 w-4" />
                New shop
              </Button>
            </Link>
          }
        />
      </DataState>
    </div>
  );
}
