"use client";

import Link from "next/link";
import { Apple, BadgeHelp, Instagram, Linkedin, Mail, MapPin, Phone, Shield, Store, Twitter } from "lucide-react";
import { themeConfig } from "@/config/theme.config";
import { apiConfig } from "@/config/api.config";
import { useCategoriesQuery } from "@/features/categories/category.hooks";

const usefulLinks = [
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/customer/addresses", label: "Addresses" },
];

const trustItems = [
  { icon: Store, label: "Fresh local shops" },
  { icon: Shield, label: "Safe checkout flow" },
  { icon: BadgeHelp, label: "Live support routes" },
];

const socialItems = [
  { icon: Twitter, href: "/support", label: "X" },
  { icon: Instagram, href: "/support", label: "Instagram" },
  { icon: Linkedin, href: "/support", label: "LinkedIn" },
];

export const CustomerFooter = () => {
  const categoriesQuery = useCategoriesQuery();
  const footerCategories = (categoriesQuery.data || []).slice(0, 12);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-[var(--color-border)] bg-white">
      <div className="flex w-full flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr_1.4fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--color-primary)] text-sm font-black text-white shadow-[var(--shadow-soft)]">
                {themeConfig.brand.shortName}
              </div>
              <div>
                <h3 className="text-lg font-bold">{themeConfig.brand.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{themeConfig.brand.tagline}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-[var(--color-text-muted)]">
              Order daily essentials, discover nearby stores, and manage repeat grocery buying without leaving the customer storefront.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Phone className="h-4 w-4 text-[var(--color-primary)]" />
                <span>{apiConfig.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Mail className="h-4 w-4 text-[var(--color-primary)]" />
                <span>{apiConfig.supportEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] sm:col-span-2">
                <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                <span>Location-aware delivery experience for your local area.</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Useful Links</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {usefulLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="grid gap-3 pt-2">
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-[16px] bg-[var(--color-muted)] px-4 py-3">
                  <item.icon className="h-4 w-4 text-[var(--color-primary)]" />
                  <span className="text-sm font-medium text-[var(--color-secondary)]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold">Categories</h3>
              <Link href="/customer/products" className="text-sm font-semibold text-[var(--color-primary)]">
                See all
              </Link>
            </div>
            <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {footerCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/customer/categories/${category.id}`}
                  className="text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-[24px] bg-[var(--color-muted)] px-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-[var(--color-text-muted)]">
            © {themeConfig.brand.name}, 2016-{year}. Built for a clean MVP grocery ordering experience.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-[var(--color-secondary)]">Download App</span>
            <div className="flex items-center gap-2 rounded-[14px] bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white">
              <Apple className="h-4 w-4" />
              <span>App Store</span>
            </div>
            <div className="flex items-center gap-2 rounded-[14px] bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white">
              <span className="text-base">▶</span>
              <span>Google Play</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {socialItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--color-secondary)] transition hover:bg-[var(--color-primary)] hover:text-white"
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
