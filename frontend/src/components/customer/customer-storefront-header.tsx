"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/providers/auth-provider";

export const CustomerStorefrontHeader = ({
  locationLabel,
  cartCount,
  searchDefaultValue = "",
}: {
  locationLabel: string;
  cartCount: number;
  searchDefaultValue?: string;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState(searchDefaultValue);
  const { isAuthenticated, loading, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#e8edf3] bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[78px] w-full max-w-[1680px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <Link href="/customer" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f9d55] text-base font-black text-white shadow-[0_14px_30px_rgba(31,157,85,0.28)]">
            Z
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a94a6]">Customer</p>
            <span className="text-[1.6rem] font-black tracking-[-0.06em] text-[#111827]">zepto</span>
          </div>
        </Link>

        <button
          type="button"
          className="hidden min-w-[250px] shrink-0 rounded-2xl border border-[#edf1f5] bg-[#fafcfd] px-4 py-3 text-left lg:block"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f9d55]">Delivery in 11 minutes</p>
          <div className="mt-1 flex items-center gap-2 text-sm font-medium text-[#111827]">
            <span className="truncate">{locationLabel}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-[#667085]" />
          </div>
        </button>

        <div className="min-w-0 flex-1">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              router.push(`/customer/products?q=${encodeURIComponent(search)}`);
            }}
          >
            <div className="flex h-[52px] items-center gap-3 rounded-[20px] border border-[#e6ebf2] bg-[#f7f9fc] px-4">
              <Search className="h-4 w-4 text-[#667085]" />
              <input
                className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#98a2b3]"
                placeholder='Search "milk", "bread", "eggs"...'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {loading ? <div className="h-11 w-24 rounded-2xl bg-[#f2f4f7]" /> : null}
          {!loading && isAuthenticated && user ? (
            <Button variant="ghost" className="h-11 rounded-2xl px-4 text-sm font-semibold" onClick={() => void logout()}>
              Logout
            </Button>
          ) : null}
          {!loading && !isAuthenticated ? (
            <Link href="/login">
              <Button variant="ghost" className="h-11 rounded-2xl px-4 text-sm font-semibold">
                Login
              </Button>
            </Link>
          ) : null}
          <Link href="/customer/cart">
            <Button className="h-11 rounded-2xl bg-[#111827] px-4 text-sm font-semibold text-white hover:bg-[#1f2937]">
              <ShoppingCart className="h-4 w-4" />
              <span>My Cart</span>
              <span
                className={cn(
                  "rounded-full bg-white/12 px-2 py-0.5 text-xs font-semibold",
                  cartCount ? "bg-[#1f9d55] text-white" : "text-white"
                )}
              >
                {cartCount}
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
