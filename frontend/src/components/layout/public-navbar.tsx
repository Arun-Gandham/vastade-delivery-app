"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reverseGeocodeCoordinates } from "@/features/addresses/address-location";
import { useLocation } from "@/hooks/use-location";

export const PublicNavbar = () => {
  const router = useRouter();
  const location = useLocation();
  const [locationLabel, setLocationLabel] = useState("Choose your delivery area");
  const [search, setSearch] = useState("");

  const refreshLocation = async () => {
    try {
      const coords = await location.requestLocation();
      const geocode = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      setLocationLabel(geocode.display_name || "Current delivery area");
    } catch {}
  };

  useEffect(() => {
    let cancelled = false;

    const loadLocation = async () => {
      try {
        const coords = await location.requestLocation();
        const geocode = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
        if (!cancelled) {
          setLocationLabel(geocode.display_name || "Current delivery area");
        }
      } catch {
        if (!cancelled) {
          setLocationLabel("Choose your delivery area");
        }
      }
    };

    void loadLocation();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#e8edf3] bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[78px] w-full max-w-[1680px] items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f9d55] text-base font-black text-white shadow-[0_14px_30px_rgba(31,157,85,0.28)]">
            Z
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a94a6]">Storefront</p>
            <span className="text-[1.6rem] font-black tracking-[-0.06em] text-[#111827]">zepto</span>
          </div>
        </Link>

        <button
          type="button"
          className="hidden w-[210px] shrink-0 rounded-2xl border border-[#edf1f5] bg-[#fafcfd] px-3 py-2.5 text-left lg:block"
          onClick={() => void refreshLocation()}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1f9d55]">Delivery in 11 minutes</p>
          <div className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-[#111827]">
            <span className="truncate">{locationLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#667085]" />
          </div>
        </button>

        <div className="min-w-0 flex-[1.35]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              router.push(`/customer/products?q=${encodeURIComponent(search)}`);
            }}
          >
            <div className="flex h-[52px] items-center gap-3 rounded-[20px] border border-[#e6ebf2] bg-[#f7f9fc] px-5">
              <Search className="h-4 w-4 shrink-0 text-[#667085]" />
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
          <Link href="/login">
            <Button variant="ghost" className="h-11 rounded-2xl px-4 text-sm font-semibold">
              Login
            </Button>
          </Link>
          <Link href="/customer/cart">
            <Button className="h-11 rounded-2xl bg-[#111827] px-4 text-sm font-semibold text-white hover:bg-[#1f2937]">
              <ShoppingCart className="h-4 w-4" />
              My Cart
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
