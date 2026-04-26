"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { themeConfig } from "@/config/theme.config";
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
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[rgba(245,247,242,0.96)] backdrop-blur">
      <div className="flex w-full flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/customer" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--color-primary)] text-sm font-black text-white shadow-[var(--shadow-soft)]">
              {themeConfig.brand.shortName}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                Delivery in 11 minutes
              </p>
              <p className="truncate text-sm font-medium text-[var(--color-text)]">
                {locationLabel}
              </p>
            </div>
          </Link>
          <div className="hidden flex-1 lg:block">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                router.push(`/customer/products?q=${encodeURIComponent(search)}`);
              }}
            >
              <div className="flex items-center gap-3 rounded-[18px] border border-[var(--color-border)] bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
                <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder='Search "milk", "bread", "eggs"...'
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {loading ? (
              <div className="h-11 w-24 rounded-[16px] bg-[var(--color-muted)]" />
            ) : isAuthenticated && user ? (
              <Button
                variant="ghost"
                className="rounded-[16px] px-4 py-3"
                onClick={() => void logout()}
              >
                Logout
              </Button>
            ) : null}
            {!loading && !isAuthenticated ? (
              <Link href="/login">
                <Button variant="ghost" className="rounded-[16px] px-4 py-3">
                  Login
                </Button>
              </Link>
            ) : null}
            <Link href="/customer/cart">
              <Button variant="outline" className="rounded-[16px] px-4 py-3">
                <span className="hidden sm:inline">My Cart</span>
                <span
                  className={cn(
                    "rounded-full bg-[var(--color-muted)] px-2 py-1 text-xs",
                    cartCount ? "bg-[var(--color-primary)] text-white" : ""
                  )}
                >
                  {cartCount}
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:hidden">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              router.push(`/customer/products?q=${encodeURIComponent(search)}`);
            }}
          >
            <div className="flex items-center gap-3 rounded-[18px] border border-[var(--color-border)] bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
              <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder='Search "milk", "bread", "eggs"...'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};
