"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceText } from "@/components/ui/price-text";
import { apiConfig } from "@/config/api.config";
import { useCategoriesQuery } from "@/features/categories/category.hooks";
import { useProductsQuery } from "@/features/products/product.hooks";

const utilityCards = [
  {
    title: "Pharmacy at your doorstep",
    description: "Cough syrups, pain relief sprays and home care essentials.",
    tone: "from-[#12babd] to-[#8be8e6]"
  },
  {
    title: "Pet care supplies at your door",
    description: "Food, treats, toys and daily care from nearby stores.",
    tone: "from-[#ffd43d] to-[#ffe58f]"
  },
  {
    title: "No time for a diaper run?",
    description: "Fast restocks for baby care, hygiene and home needs.",
    tone: "from-[#dae7ff] to-[#f8fbff]"
  }
];

const usefulLinks = [
  { href: "/about", label: "Blog" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "FAQs" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" }
];

export default function HomePage() {
  const categoriesQuery = useCategoriesQuery();
  const productsQuery = useProductsQuery({ page: 1, limit: 48 });

  const categories = categoriesQuery.data || [];
  const products = productsQuery.data || [];
  const featuredCategories = categories.slice(0, 12);

  const categorySections = categories
    .map((category) => ({
      category,
      products: products.filter((product) => product.categoryId === category.id).slice(0, 6)
    }))
    .filter((entry) => entry.products.length > 0)
    .slice(0, 4);

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto flex w-full max-w-[1680px] flex-col gap-12 px-4 py-6 sm:px-6 lg:px-10">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-[#2f7d3e] via-[#4ea048] to-[#d8f1b6] px-8 py-10 text-white">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Quick delivery</p>
                <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                  Get farm-fresh groceries, fruits, vegetables, eggs and more.
                </h1>
                <p className="max-w-2xl text-base text-white/90 md:text-lg">
                  Browse live categories and products from the backend catalog, then move into the customer
                  storefront for cart, checkout, orders and profile flows.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/customer">
                    <Button className="h-12 rounded-2xl bg-white px-6 text-base font-semibold text-[#1f2937] hover:bg-white/90">
                      Shop Now
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="ghost"
                      className="h-12 rounded-2xl border border-white/25 bg-white/10 px-6 text-base font-semibold text-white hover:bg-white/15"
                    >
                      Start Ordering
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-[24px] bg-white/14 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/75">Categories</p>
                  <p className="mt-3 text-3xl font-black">{categories.length}</p>
                  <p className="mt-2 text-sm text-white/80">Live category tiles from the backend.</p>
                </div>
                <div className="rounded-[24px] bg-white/14 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/75">Products</p>
                  <p className="mt-3 text-3xl font-black">{products.length}</p>
                  <p className="mt-2 text-sm text-white/80">Featured items loaded directly from product APIs.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {utilityCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-[28px] bg-gradient-to-br ${card.tone} p-6 text-[#111827] shadow-sm`}
              >
                <h2 className="max-w-sm text-[2rem] font-black leading-tight">{card.title}</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#374151]">{card.description}</p>
                <Link
                  href="/customer"
                  className="mt-6 inline-flex items-center rounded-xl bg-[#2f3133] px-4 py-3 text-sm font-semibold text-white"
                >
                  Order Now
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#111827]">Shop by category</h2>
            <Link href="/customer/products" className="text-lg font-medium text-[#1f9d55]">
              see all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/customer/categories/${category.id}`}
                className="group rounded-[26px] border border-[#ececec] bg-white p-4 shadow-sm transition hover:-translate-y-1"
              >
                <div className="mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-[22px] bg-[#f4f7fb]">
                  {category.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[#1f9d55]">
                      {category.name}
                    </span>
                  )}
                </div>
                <p className="text-center text-base font-semibold leading-6 text-[#111827]">{category.name}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          {categorySections.map(({ category, products: sectionProducts }) => (
            <div key={category.id} className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-3xl font-black tracking-[-0.04em] text-[#111827]">{category.name}</h2>
                <Link href={`/customer/categories/${category.id}`} className="text-lg font-medium text-[#1f9d55]">
                  see all
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {sectionProducts.map((product) => (
                  <Card key={product.id} className="flex h-full flex-col gap-4 rounded-[22px] border border-[#ebebeb] p-4 shadow-sm">
                    <div className="flex h-40 items-center justify-center overflow-hidden rounded-[18px] bg-[#f8fafc]">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-4" />
                      ) : (
                        <span className="text-sm font-semibold text-[#6b7280]">{product.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#111827]">
                      <Clock3 className="h-3.5 w-3.5 text-[#1f9d55]" />
                      <span>11 mins</span>
                    </div>
                    <div className="flex-1">
                      <Link href={`/customer/products/${product.id}`} className="line-clamp-2 text-lg font-semibold text-[#111827]">
                        {product.name}
                      </Link>
                      <p className="mt-2 text-sm text-[#6b7280]">{product.unit}</p>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex flex-col">
                        <PriceText value={product.sellingPrice} className="text-lg font-bold text-[#111827]" />
                        <span className="text-sm text-[#9ca3af] line-through">
                          <PriceText value={product.mrp} />
                        </span>
                      </div>
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="h-11 rounded-xl border-[#58b23d] px-6 text-base font-semibold text-[#58b23d] hover:bg-[#f5fff1]"
                        >
                          Add
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[32px] bg-[#f6f7f9] px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f9d55]">Why this storefront</p>
              <h2 className="text-3xl font-black tracking-[-0.04em] text-[#111827]">
                Browse the live catalog first, then move into customer ordering.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[#6b7280]">
                This public landing page now surfaces real categories and products from the frontend API layer
                while keeping checkout, cart and account flows inside the customer app.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="rounded-[24px] border-0 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f9d55]">Categories</p>
                <p className="mt-3 text-3xl font-black text-[#111827]">{categories.length}</p>
                <p className="mt-2 text-sm text-[#6b7280]">Live category tiles from the backend catalog.</p>
              </Card>
              <Card className="rounded-[24px] border-0 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f9d55]">Products</p>
                <p className="mt-3 text-3xl font-black text-[#111827]">{products.length}</p>
                <p className="mt-2 text-sm text-[#6b7280]">Featured items loaded directly from product APIs.</p>
              </Card>
              <Card className="rounded-[24px] border-0 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f9d55]">Ordering</p>
                <p className="mt-3 text-3xl font-black text-[#111827]">11 min</p>
                <p className="mt-2 text-sm text-[#6b7280]">Fast path into the customer shopping experience.</p>
              </Card>
            </div>
          </div>
        </section>

        <footer className="mt-4 border-t border-[#efefef] pt-10">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.55fr]">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-[2rem] font-black tracking-[-0.08em] text-[#1f9d55]">zepto</h3>
                <p className="max-w-md text-sm leading-7 text-[#6b7280]">
                  Public storefront for browsing categories and products before customers move into the
                  authenticated shopping flow.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-[1.02rem] text-[#6b7280]">
                {usefulLinks.map((link) => (
                  <Link key={`${link.href}-${link.label}`} href={link.href} className="transition hover:text-[#1f9d55]">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="text-sm text-[#6b7280]">
                Support:
                <span className="ml-2">{apiConfig.supportPhone || "Phone from env"}</span>
                <span className="ml-4">{apiConfig.supportEmail || "Email from env"}</span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-bold tracking-[-0.03em] text-[#111827]">Categories</h3>
                <Link href="/customer/products" className="text-lg font-medium text-[#1f9d55]">
                  see all
                </Link>
              </div>
              <div className="grid gap-x-8 gap-y-4 text-[1.02rem] text-[#6b7280] sm:grid-cols-2 lg:grid-cols-3">
                {featuredCategories.map((category) => (
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
          <div className="mt-10 rounded-[26px] bg-[#f7f7f7] px-6 py-6 text-sm leading-7 text-[#6b7280]">
            Browse categories and products here, then continue to the customer app for cart, checkout,
            orders, addresses and profile flows.
          </div>
        </footer>
      </main>
    </>
  );
}
