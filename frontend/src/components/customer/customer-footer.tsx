"use client";

import Link from "next/link";
import { Apple, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { apiConfig } from "@/config/api.config";
import { useCategoriesQuery } from "@/features/categories/category.hooks";

const usefulLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "FAQs" },
  { href: "/contact", label: "Contact" },
  { href: "/customer/addresses", label: "Addresses" }
];

const socialItems = [
  { icon: Twitter, href: "/support", label: "X" },
  { icon: Instagram, href: "/support", label: "Instagram" },
  { icon: Linkedin, href: "/support", label: "LinkedIn" }
];

export const CustomerFooter = () => {
  const categoriesQuery = useCategoriesQuery();
  const footerCategories = (categoriesQuery.data || []).slice(0, 9);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 w-full border-t border-[#eceff3] bg-[#fbfcfd]">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[1.7rem] font-black tracking-[-0.08em] text-[#1f9d55]">zepto</span>
              <span className="rounded-full bg-[#eef8f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f9d55]">
                Customer
              </span>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#6b7280]">
              Fast local grocery ordering with a cleaner storefront for products, shops, orders and profile flows.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-[#4b5563]">
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">Fresh local shops</span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">Fast checkout</span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">Nearby delivery</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#111827]">Useful Links</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-[#6b7280]">
              {usefulLinks.map((link) => (
                <Link key={`${link.href}-${link.label}`} href={link.href} className="transition hover:text-[#1f9d55]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#111827]">Popular Categories</h3>
              <Link href="/customer/products" className="text-sm font-semibold text-[#1f9d55]">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-[#6b7280]">
              {footerCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/customer/categories/${category.id}`}
                  className="transition hover:text-[#1f9d55]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#eceff3] pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 text-sm text-[#6b7280] lg:flex-row lg:items-center lg:gap-6">
            <span className="font-medium text-[#4b5563]">Copyright Blink Commerce Private Limited, 2016-{year}</span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#1f9d55]" />
              {apiConfig.supportPhone || "Support phone"}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#1f9d55]" />
              {apiConfig.supportEmail || "Support email"}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#1f9d55]" />
              Nearby delivery support
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl bg-[#111827] px-3 py-2 text-xs font-semibold text-white sm:flex">
              <Apple className="h-4 w-4" />
              <span>App Store</span>
            </div>
            <div className="hidden items-center gap-2 rounded-xl bg-[#111827] px-3 py-2 text-xs font-semibold text-white sm:flex">
              <span>Play</span>
              <span>Google Play</span>
            </div>
            {socialItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6e9ee] bg-white text-[#111827] transition hover:border-[#1f9d55] hover:text-[#1f9d55]"
                aria-label={item.label}
              >
                <item.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
