"use client";

import { usePathname, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ProductFormCard } from "@/components/dashboard/product-form-card";

export default function AdminProductCreatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.startsWith("/super-admin") ? "/super-admin" : "/admin";

  return (
    <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
      <ProductFormCard mode="create" onSuccess={(savedProductId) => router.push(savedProductId ? `${basePath}/products/${savedProductId}` : `${basePath}/products`)} />

      <Card className="rounded-[30px] border border-[#e8edf3] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a94a6]">Create flow</p>
        <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#111827]">Dedicated page for cleaner management</h2>
        <div className="mt-6 space-y-4 text-sm leading-7 text-[#667085]">
          <p>Product listing stays focused on image, price, and category visibility.</p>
          <p>Create and edit actions open separately so management forms do not interrupt catalog scanning.</p>
        </div>
      </Card>
    </div>
  );
}
