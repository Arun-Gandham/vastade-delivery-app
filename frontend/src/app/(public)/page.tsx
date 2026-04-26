import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { themeConfig } from "@/config/theme.config";
import { apiConfig } from "@/config/api.config";

const features = [
  "Real-time-ready customer ordering flow",
  "Shop-owner inventory and order operations",
  "Captain pickup, COD, and delivery updates",
  "Responsive admin oversight with reports",
];

export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <main className="app-shell flex flex-col gap-10 py-12">
        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
              {themeConfig.brand.tagline}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Grocery delivery built for the first-mile realities of small, fast local commerce.
            </h1>
            <p className="max-w-2xl text-lg text-[var(--color-text-muted)]">
              Browse nearby shops, place orders, manage stock, and complete deliveries through one role-based platform connected directly to your backend.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
          <Card className="flex flex-col gap-4 bg-[linear-gradient(180deg,rgba(31,157,85,0.08),rgba(255,255,255,1))]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              MVP Coverage
            </p>
            {features.map((feature) => (
              <div key={feature} className="rounded-[var(--radius-lg)] bg-white p-4 text-sm shadow-[var(--shadow-soft)]">
                {feature}
              </div>
            ))}
            <p className="text-sm text-[var(--color-text-muted)]">
              API base: <span className="font-medium text-[var(--color-text)]">{apiConfig.baseURL}</span>
            </p>
          </Card>
        </section>
      </main>
    </>
  );
}
